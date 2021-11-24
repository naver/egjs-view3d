/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

/**
 * Component that manages animations of the 3D Model
 * @category Core
 */
class ModelAnimator {
  private _mixer: THREE.AnimationMixer;
  private _clips: THREE.AnimationClip[];
  private _actions: THREE.AnimationAction[];

  /**
   * Three.js {@link https://threejs.org/docs/#api/en/animation/AnimationClip AnimationClip}s that stored
   * @type THREE.AnimationClip
   * @readonly
   */
  public get clips() { return this._clips; }

  /**
   * {@link https://threejs.org/docs/index.html#api/en/animation/AnimationMixer THREE.AnimationMixer} instance
   * @type THREE.AnimationMixer
   * @readonly
   */
  public get mixer() { return this._mixer; }

  /**
   * Create new ModelAnimator instance
   * @param scene {@link https://threejs.org/docs/index.html#api/en/scenes/Scene THREE.Scene} instance that is root of all 3d objects
   */
  public constructor(scene: THREE.Scene) {
    this._mixer = new THREE.AnimationMixer(scene);
    this._clips = [];
    this._actions = [];
  }

  /**
   * Store the given clips
   * @param clips Three.js {@link https://threejs.org/docs/#api/en/animation/AnimationClip AnimationClip}s of the model
   * @returns {void} Nothing
   * @example
   * ```ts
   * // After loading model
   * view3d.animator.setClips(model.animations);
   * ```
   */
  public setClips(clips: THREE.AnimationClip[]): void {
    const mixer = this._mixer;
    this._clips = clips;
    this._actions = clips.map(clip => mixer.clipAction(clip));
  }

  /**
   * Play one of the model's animation
   * @param index Index of the animation to play
   * @returns {void} Nothing
   */
  public play(index: number): void {
    const action = this._actions[index];

    if (action) {
      action.play();
    }
  }

  /**
   * Pause one of the model's animation
   * If you want to stop animation completely, you should call {@link ModelAnimator#stop stop} instead
   * You should call {@link ModelAnimator#resume resume} to resume animation
   * @param index Index of the animation to pause
   * @returns {void} Nothing
   */
  public pause(index: number): void {
    const action = this._actions[index];

    if (action) {
      action.timeScale = 0;
    }
  }

  /**
   * Resume one of the model's animation
   * This will play animation from the point when the animation is paused
   * @param index Index of the animation to resume
   * @returns {void} Nothing
   */
  public resume(index: number): void {
    const action = this._actions[index];

    if (action) {
      action.timeScale = 1;
    }
  }

  /**
   * Fully stops one of the model's animation
   * @param index Index of the animation to stop
   * @returns {void} Nothing
   */
  public stop(index: number): void {
    const action = this._actions[index];

    if (action) {
      action.stop();
    }
  }

  /**
   * Update animations
   * @param delta number of seconds to play animations attached
   * @returns {void} Nothing
   */
  public update(delta: number): void {
    this._mixer.update(delta);
  }

  /**
   * Reset the instance and remove all cached animation clips attached to it
   * @returns {void} Nothing
   */
  public reset(): void {
    const mixer = this._mixer;

    mixer.uncacheRoot(mixer.getRoot());

    this._clips = [];
    this._actions = [];
  }
}

export default ModelAnimator;
