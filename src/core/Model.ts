/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

import { range } from "../utils";

/**
 * Data class for loaded 3d model
 */
class Model {
  private _scene: THREE.Group;
  private _bbox: THREE.Box3;
  private _animations: THREE.AnimationClip[];
  private _fixSkinnedBbox: boolean;

  /**
   * Scene of the model, see {@link https://threejs.org/docs/#api/en/objects/Group THREE.Group}
   * @readonly
   */
  public get scene() { return this._scene; }
  /**
   * {@link https://threejs.org/docs/#api/en/animation/AnimationClip THREE.AnimationClip}s inside model
   */
  public get animations() { return this._animations; }
  /** *
   * {@link https://threejs.org/docs/#api/en/lights/Light THREE.Light}s inside model if there's any.
   * @readonly
   */
  public get lights() {
    return this._getAllLights();
  }

  /**
   * {@link https://threejs.org/docs/#api/en/objects/Mesh THREE.Mesh}es inside model if there's any.
   * @readonly
   */
  public get meshes() {
    return this._getAllMeshes();
  }

  /**
   * Get a copy of model's current bounding box
   * @type THREE#Box3
   * @see https://threejs.org/docs/#api/en/math/Box3
   */
  public get bbox() {
    return this._bbox;
  }

  /**
   * Whether to apply inference from skeleton when calculating bounding box
   * This can fix some models with skinned mesh when it has wrong bounding box
   * @type boolean
   */
  public get fixSkinnedBbox() { return this._fixSkinnedBbox; }

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

  public set fixSkinnedBbox(val: boolean) { this._fixSkinnedBbox = val; }

  /**
   * Create new Model instance
   */
  public constructor({
    scenes,
    animations = [],
    fixSkinnedBbox = false,
    castShadow = true,
    receiveShadow = false
  }: {
    scenes: THREE.Object3D[];
    animations?: THREE.AnimationClip[];
    fixSkinnedBbox?: boolean;
    castShadow?: boolean;
    receiveShadow?: boolean;
  }) {
    // This guarantees model's root has identity matrix at creation
    this._scene = new THREE.Group();
    this._scene.add(...scenes);

    this._animations = animations;
    this._fixSkinnedBbox = fixSkinnedBbox;

    this._bbox = this._getInitialBbox();

    // Move to position where bbox.min.y = 0
    const offset = this._bbox.min.y;
    this._scene.translateY(-offset);
    this._bbox.translate(new THREE.Vector3(0, -offset, 0));

    this.castShadow = castShadow;
    this.receiveShadow = receiveShadow;
  }

  public reduceVertices<T>(callbackfn: (previousVal: T, currentVal: THREE.Vector3) => T, initialVal: T) {
    const meshes = this.meshes;

    let result = initialVal;

    meshes.forEach(mesh => {
      const { position } = mesh.geometry.attributes;
      if (!position) return;

      mesh.updateMatrixWorld();

      range(position.count).forEach(idx => {
        const vertex = new THREE.Vector3().fromBufferAttribute(position, idx);

        vertex.applyMatrix4(mesh.matrixWorld);
        result = callbackfn(result, vertex);
      });
    });

    return result;
  }

  private _getInitialBbox() {
    this._scene.updateMatrixWorld();

    if (this._fixSkinnedBbox && this._hasSkinnedMesh()) {
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

      const geometry = mesh.geometry;
      const positions = geometry.attributes.position;
      const skinIndicies = geometry.attributes.skinIndex;
      const skinWeights = geometry.attributes.skinWeight;
      const skeleton = mesh.skeleton;

      skeleton.update();
      const boneMatricies = skeleton.boneMatrices;

      const finalMatrix = new THREE.Matrix4();
      for (let posIdx = 0; posIdx < positions.count; posIdx++) {
        finalMatrix.identity();

        const skinned = new THREE.Vector4();
        skinned.set(0, 0, 0, 0);
        const skinVertex = new THREE.Vector4();
        skinVertex.set(
          positions.getX(posIdx),
          positions.getY(posIdx),
          positions.getZ(posIdx),
          1,
        ).applyMatrix4(mesh.bindMatrix);

        const weights = [
          skinWeights.getX(posIdx),
          skinWeights.getY(posIdx),
          skinWeights.getZ(posIdx),
          skinWeights.getW(posIdx)
        ];

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

        bbox.expandByPoint(transformed);
      }
    });

    return bbox;
  }

  private _getAllLights(): THREE.Light[] {
    const lights: THREE.Light[] = [];

    this._scene.traverse(obj => {
      if ((obj as any).isLight) {
        lights.push(obj as THREE.Light);
      }
    });

    return lights;
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
    return this.meshes.some(mesh => (mesh as THREE.SkinnedMesh).isSkinnedMesh);
  }
}

export default Model;
