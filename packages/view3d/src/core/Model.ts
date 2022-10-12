/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";
import { GLTFParser } from "three/examples/jsm/loaders/GLTFLoader";

import { getAttributeScale, getSkinnedVertex, parseAsBboxRatio, isString } from "../utils";
import { VARIANT_EXTENSION } from "../const/internal";

import { Annotation } from "../annotation";
import { AUTO } from "../const/external";

/**
 * Data class for loaded 3d model
 */
class Model {
  private _src: string;
  private _scene: THREE.Group;
  private _parser: GLTFParser | null;
  private _bbox: THREE.Box3;
  private _center: THREE.Vector3;
  private _animations: THREE.AnimationClip[];
  private _annotations: Annotation[];
  private _variants: Array<{ name: string }>;
  private _fixSkinnedBbox: boolean;

  /**
   * Source URL of this model
   * @type {string}
   * @readonly
   */
  public get src() { return this._src; }
  /**
   * Scene of the model, see {@link https://threejs.org/docs/#api/en/objects/Group THREE.Group}
   * @readonly
   */
  public get scene() { return this._scene; }
  /**
   * {@link https://threejs.org/docs/#api/en/animation/AnimationClip THREE.AnimationClip}s inside model
   * @readonly
   */
  public get animations() { return this._animations; }
  /**
   * {@link Annotation}s included inside the model
   * @readonly
   */
  public get annotations() { return this._annotations; }
  /**
   * {@link https://threejs.org/docs/#api/en/objects/Mesh THREE.Mesh}es inside model if there's any.
   * @readonly
   */
  public get meshes() { return this._getAllMeshes(); }
  /**
   * Get a copy of model's current bounding box
   * @type THREE#Box3
   * @readonly
   * @see https://threejs.org/docs/#api/en/math/Box3
   */
  public get bbox() { return this._bbox; }
  /**
   * Center of the model
   * @type THREE#Vector3
   * @readonly
   * @see https://threejs.org/docs/#api/en/math/Vector3
   */
  public get center() { return this._center; }

  /**
   * Whether the model's meshes gets rendered into shadow map
   * @type boolean
   * @example
   * ```ts
   * model.castShadow = true;
   * ```
   */
  public set castShadow(val: boolean) {
    const meshes = this.meshes;
    meshes.forEach(mesh => mesh.castShadow = val);
  }

  /**
   * Whether the model's mesh materials receive shadows
   * @type boolean
   * @example
   * ```ts
   * model.receiveShadow = true;
   * ```
   */
  public set receiveShadow(val: boolean) {
    const meshes = this.meshes;
    meshes.forEach(mesh => mesh.receiveShadow = val);
  }

  /**
   * Create new Model instance
   */
  public constructor({
    src,
    scenes,
    center = AUTO,
    parser = null,
    animations = [],
    annotations = [],
    variants = [],
    fixSkinnedBbox = false,
    castShadow = true,
    receiveShadow = false
  }: {
    src: string;
    scenes: THREE.Object3D[];
    center?: typeof AUTO | Array<number | string>;
    parser?: GLTFParser | null,
    animations?: THREE.AnimationClip[];
    annotations?: Annotation[];
    variants?: Array<{ name: string }>;
    fixSkinnedBbox?: boolean;
    castShadow?: boolean;
    receiveShadow?: boolean;
  }) {
    this._src = src;

    const scene = new THREE.Group();
    scene.add(...scenes);

    this._scene = scene;
    this._parser = parser;
    this._animations = animations;
    this._annotations = annotations;
    this._variants = variants;
    const bbox = this._getInitialBbox(fixSkinnedBbox);

    // Move to position where bbox.min.y = 0
    const offset = bbox.min.y;
    scene.translateY(-offset);
    scene.updateMatrixWorld();
    bbox.translate(new THREE.Vector3(0, -offset, 0));

    this._fixSkinnedBbox = fixSkinnedBbox;
    this._bbox = bbox;
    this._center = center === AUTO
      ? bbox.getCenter(new THREE.Vector3())
      : parseAsBboxRatio(center, bbox)
    this.castShadow = castShadow;
    this.receiveShadow = receiveShadow;
  }

  public async selectVariant(variant: number | string | null) {
    const variants = this._variants;
    const parser = this._parser;

    if (variants.length <= 0 || !parser) return;

    let variantIndex = 0;
    if (variant != null) {
      if (isString(variant)) {
        variantIndex = variants.findIndex(({ name }) => name === variant);
      } else {
        variantIndex = variant
      }
    }

    const scene = this._scene;
    const matLoadPromises: Promise<any>[] = [];

    scene.traverse(async (obj: THREE.Mesh) => {
      if (!obj.isMesh || !obj.userData.gltfExtensions) return;

      const meshVariantDef = obj.userData.gltfExtensions[VARIANT_EXTENSION];

      if (!meshVariantDef) return;

      if (!obj.userData.originalMaterial) {
        obj.userData.originalMaterial = obj.material;
      }

      const mapping = meshVariantDef.mappings
        .find(mapping => mapping.variants.includes(variantIndex));

      if (mapping) {
        const loadMat = parser.getDependency("material", mapping.material);
        matLoadPromises.push(loadMat);

        obj.material = await loadMat;
        parser.assignFinalMaterial(obj);
      } else {
        obj.material = obj.userData.originalMaterial;
      }
    });

    return Promise.all(matLoadPromises);
  }

  /**
   * Executes a user-supplied "reducer" callback function on each vertex of the model, in order, passing in the return value from the calculation on the preceding element.
   */
  public reduceVertices<T>(callbackfn: (previousVal: T, currentVal: THREE.Vector3) => T, initialVal: T) {
    const meshes = this.meshes;

    let result = initialVal;

    meshes.forEach(mesh => {
      const { position } = mesh.geometry.attributes;
      if (!position) return;

      mesh.updateMatrixWorld();

      if (this._fixSkinnedBbox && (mesh as THREE.SkinnedMesh).isSkinnedMesh) {
        this._forEachSkinnedVertices(mesh as THREE.SkinnedMesh, vertex => {
          result = callbackfn(result, vertex);
        });
      } else {
        const posScale = getAttributeScale(position);

        for (let idx = 0; idx < position.count; idx++) {
          const vertex = new THREE.Vector3()
            .fromBufferAttribute(position, idx);

          if (position.normalized) {
            vertex.multiplyScalar(posScale);
          }
          vertex.applyMatrix4(mesh.matrixWorld);

          result = callbackfn(result, vertex);
        }
      }
    });

    return result;
  }

  private _getInitialBbox(fixSkinnedBbox: boolean) {
    this._scene.updateMatrixWorld();

    if (fixSkinnedBbox && this._hasSkinnedMesh()) {
      return this._getSkeletonBbox();
    } else {
      return new THREE.Box3().setFromObject(this._scene);
    }
  }

  private _getSkeletonBbox() {
    const bbox = new THREE.Box3();

    this.meshes.forEach((mesh: THREE.SkinnedMesh) => {
      if (!mesh.isSkinnedMesh) {
        bbox.expandByObject(mesh);
        return;
      }

      this._forEachSkinnedVertices(mesh, vertex => bbox.expandByPoint(vertex));
    });

    return bbox;
  }

  /**
   * Get all {@link https://threejs.org/docs/#api/en/objects/Mesh THREE.Mesh}es inside model if there's any.
   * @private
   * @returns Meshes found at model's scene
   */
  private _getAllMeshes(): THREE.Mesh[] {
    const meshes: THREE.Mesh[] = [];

    this._scene.traverse(obj => {
      if ((obj as any).isMesh) {
        meshes.push(obj as THREE.Mesh);
      }
    });

    return meshes.sort((a, b) => a.name.localeCompare(b.name));
  }

  private _hasSkinnedMesh(): boolean {
    return this._getAllMeshes().some(mesh => (mesh as THREE.SkinnedMesh).isSkinnedMesh);
  }

  private _forEachSkinnedVertices(mesh: THREE.SkinnedMesh, callback: (vertex: THREE.Vector3) => any) {
    const geometry = mesh.geometry;
    const positions = geometry.attributes.position;
    const skinWeights = geometry.attributes.skinWeight;
    const skeleton = mesh.skeleton;

    skeleton.update();

    const positionScale = getAttributeScale(positions);
    const skinWeightScale = getAttributeScale(skinWeights);

    for (let posIdx = 0; posIdx < positions.count; posIdx++) {
      const transformed = getSkinnedVertex(posIdx, mesh, positionScale, skinWeightScale);

      callback(transformed);
    }
  }
}

export default Model;
