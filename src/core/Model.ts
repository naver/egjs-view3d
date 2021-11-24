/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

/**
 * Data class for loaded 3d model
 * @category Core
 */
class Model {
  private _scene: THREE.Group;
  private _animations: THREE.AnimationClip[];
  private _initialBbox: THREE.Box3;
  private _originalSize: number;
  private _cachedLights: THREE.Light[] | null;
  private _cachedMeshes: THREE.Mesh[] | null;
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
    return this._cachedLights ? this._cachedLights : this._getAllLights();
  }

  /**
   * {@link https://threejs.org/docs/#api/en/objects/Mesh THREE.Mesh}es inside model if there's any.
   * @readonly
   */
  public get meshes() {
    return this._cachedMeshes ? this._cachedMeshes : this._getAllMeshes();
  }

  /**
   * Get a copy of model's current bounding box
   * @type THREE#Box3
   * @see https://threejs.org/docs/#api/en/math/Box3
   */
  public get bbox() {
    return this._getTransformedBbox();
  }

  /**
   * Get a copy of model's initial bounding box without transform
   */
  public get initialBbox() {
    return this._initialBbox.clone();
  }

  /**
   * Model's bounding box size
   * Changing this will scale the model.
   * @type number
   * @example
   * import { GLTFLoader } from "@egjs/view3d";
   * new GLTFLoader().load(URL_TO_GLTF)
   *  .then(model => {
   *    model.size = 100;
   *  })
   */
  public get size() {
    return this._getTransformedBbox().getSize(new THREE.Vector3()).length();
  }

  /**
   * Whether to apply inference from skeleton when calculating bounding box
   * This can fix some models with skinned mesh when it has wrong bounding box
   * @type boolean
   */
  public get fixSkinnedBbox() { return this._fixSkinnedBbox; }

  /**
   * Return the model's original bbox size before applying any transform
   * @type number
   */
  public get originalSize() { return this._originalSize; }

  /**
   * Whether the model's meshes gets rendered into shadow map
   * @type boolean
   * @example
   * model.castShadow = true;
   */
  public set castShadow(val: boolean) {
    const meshes = this.meshes;
    meshes.forEach(mesh => mesh.castShadow = val);
  }

  /**
   * Whether the model's mesh materials receive shadows
   * @type boolean
   * @example
   * model.receiveShadow = true;
   */
  public set receiveShadow(val: boolean) {
    const meshes = this.meshes;
    meshes.forEach(mesh => mesh.receiveShadow = val);
  }

  public set size(val: number) {
    const scene = this._scene;
    const initialBbox = this._initialBbox;

    // Modify scale
    const bboxSize = initialBbox.getSize(new THREE.Vector3());
    const scale = val / bboxSize.length();
    scene.scale.setScalar(scale);
    scene.updateMatrix();
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
    const pivot = new THREE.Object3D();
    pivot.name = "Pivot";
    pivot.add(...scenes);
    this._scene.add(pivot);

    this._animations = animations;
    this._fixSkinnedBbox = fixSkinnedBbox;
    this._cachedLights = null;
    this._cachedMeshes = null;

    this._setInitialBbox();

    const bboxCenter = this._initialBbox.getCenter(new THREE.Vector3());
    pivot.position.copy(bboxCenter.negate());

    this._moveInitialBboxToCenter();

    this._originalSize = this.size;

    this.castShadow = castShadow;
    this.receiveShadow = receiveShadow;
  }

  /**
   * Translate the model to center the model's bounding box to world origin (0, 0, 0).
   */
  public moveToOrigin() {
    // Translate scene position to origin
    const scene = this._scene;
    const initialBbox = this._initialBbox.clone();

    initialBbox.min.multiply(scene.scale);
    initialBbox.max.multiply(scene.scale);

    const bboxCenter = initialBbox.getCenter(new THREE.Vector3());
    scene.position.copy(bboxCenter.negate());
    scene.updateMatrix();
  }

  private _setInitialBbox() {
    this._scene.updateMatrixWorld();
    if (this._fixSkinnedBbox && this._hasSkinnedMesh()) {
      this._initialBbox = this._getSkeletonBbox();
    } else {
      this._initialBbox = new THREE.Box3().setFromObject(this._scene);
    }
  }

  private _getSkeletonBbox() {
    const bbox = new THREE.Box3();

    this.meshes.forEach((mesh: THREE.SkinnedMesh) => {
      if (!mesh.isSkinnedMesh) {
        bbox.expandByObject(mesh);
        return;
      }

      const geometry = mesh.geometry as THREE.BufferGeometry;
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

  private _moveInitialBboxToCenter() {
    const bboxCenter = this._initialBbox.getCenter(new THREE.Vector3());
    this._initialBbox.translate(bboxCenter.negate());
  }

  private _getAllLights(): THREE.Light[] {
    const lights: THREE.Light[] = [];

    this._scene.traverse(obj => {
      if ((obj as any).isLight) {
        lights.push(obj as THREE.Light);
      }
    });

    this._cachedLights = lights;

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

    this._cachedMeshes = meshes;

    return meshes;
  }

  private _hasSkinnedMesh(): boolean {
    return this.meshes.some(mesh => (mesh as THREE.SkinnedMesh).isSkinnedMesh);
  }

  private _getTransformedBbox(): THREE.Box3 {
    return this._initialBbox.clone().applyMatrix4(this._scene.matrix);
  }
}

export default Model;
