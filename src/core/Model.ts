/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";
import { Vector3 } from "three";

import { TypedArray } from "../type/utils";

/**
 * Data class for loaded 3d model
 */
class Model {
  private _src: string;
  private _scene: THREE.Group;
  private _bbox: THREE.Box3;
  private _animations: THREE.AnimationClip[];
  private _json: Record<string, any>;
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
   * JSON data of original glTF file
   * @readonly
   */
  public get json() { return this._json; }
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
    animations = [],
    json = {},
    fixSkinnedBbox = false,
    castShadow = true,
    receiveShadow = false
  }: {
    src: string;
    scenes: THREE.Object3D[];
    animations?: THREE.AnimationClip[];
    json?: any; // Original json of the glTF file
    fixSkinnedBbox?: boolean;
    castShadow?: boolean;
    receiveShadow?: boolean;
  }) {
    this._src = src;

    // This guarantees model's root has identity matrix at creation
    const scene = new THREE.Group();
    scene.add(...scenes);

    this._animations = animations;
    this._json = json;
    this._scene = scene;
    const bbox = this._getInitialBbox(fixSkinnedBbox);

    // Move to position where bbox.min.y = 0
    const offset = bbox.min.y;
    scene.translateY(-offset);
    scene.updateMatrixWorld();
    bbox.translate(new THREE.Vector3(0, -offset, 0));

    this._fixSkinnedBbox = fixSkinnedBbox;
    this._bbox = bbox;
    this.castShadow = castShadow;
    this.receiveShadow = receiveShadow;
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
        for (let idx = 0; idx < position.count; idx++) {
          const vertex = new THREE.Vector3().fromBufferAttribute(position, idx);

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

    return meshes;
  }

  private _hasSkinnedMesh(): boolean {
    return this._getAllMeshes().some(mesh => (mesh as THREE.SkinnedMesh).isSkinnedMesh);
  }

  private _forEachSkinnedVertices(mesh: THREE.SkinnedMesh, callback: (vertex: THREE.Vector3) => any) {
    const geometry = mesh.geometry;
    const positions = geometry.attributes.position;
    const skinIndicies = geometry.attributes.skinIndex;
    const skinWeights = geometry.attributes.skinWeight;
    const skeleton = mesh.skeleton;

    skeleton.update();
    const boneMatricies = skeleton.boneMatrices;

    const skinWeightScale = (skinWeights.normalized && ArrayBuffer.isView(skinWeights.array))
      ? 1 / (Math.pow(2, 8 * (skinWeights.array as TypedArray).BYTES_PER_ELEMENT) - 1)
      : 1;

    for (let posIdx = 0; posIdx < positions.count; posIdx++) {
      const pos = new Vector3().fromBufferAttribute(positions, posIdx);
      const skinned = new THREE.Vector4(0, 0, 0, 0);
      const skinVertex = new THREE.Vector4(pos.x, pos.y, pos.z).applyMatrix4(mesh.bindMatrix);

      const weights = [
        skinWeights.getX(posIdx),
        skinWeights.getY(posIdx),
        skinWeights.getZ(posIdx),
        skinWeights.getW(posIdx)
      ].map(weight => weight * skinWeightScale);

      const indicies = [
        skinIndicies.getX(posIdx),
        skinIndicies.getY(posIdx),
        skinIndicies.getZ(posIdx),
        skinIndicies.getW(posIdx)
      ];

      weights.forEach((weight, index) => {
        const boneMatrix = new THREE.Matrix4().fromArray(boneMatricies, indicies[index] * 16);
        skinned.add(skinVertex.clone().applyMatrix4(boneMatrix).multiplyScalar(weight));
      });

      const transformed = new THREE.Vector3().fromArray(skinned.applyMatrix4(mesh.bindMatrixInverse).toArray());
      transformed.applyMatrix4(mesh.matrixWorld);

      callback(transformed);
    }
  }
}

export default Model;
