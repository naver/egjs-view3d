/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

/**
 * Component that manages animations of the 3D Model
 */
class ModelAnimator {
  private _mixer: THREE.AnimationMixer;
  private _clips: THREE.AnimationClip[];
  private _actions: THREE.AnimationAction[];
  private _activeAnimationIdx: number;

  /**
   * Three.js {@link https://threejs.org/docs/#api/en/animation/AnimationClip AnimationClip}s that stored
   * @type THREE.AnimationClip
   * @readonly
   */
  public get clips() { return this._clips; }

  /**
   * {@link https://threejs.org/docs/#api/en/animation/AnimationMixer THREE.AnimationMixer} instance
   * @type THREE.AnimationMixer
   * @readonly
   */
  public get mixer() { return this._mixer; }

  /**
   * An array of active {@link https://threejs.org/docs/#api/en/animation/AnimationAction AnimationAction}s
   * @type THREE.AnimationAction
   * @readonly
   */
  public get actions() { return this._actions; }

  /**
   * Current length of animations
   * @type {number}
   * @readonly
   */
  public get animationCount() { return this._clips.length; }

  /**
   * Infomation of the animation currently playing, `null` if there're no animation or stopped.
   * @see {@link https://threejs.org/docs/#api/en/animation/AnimationClip AnimationClip}
   * @type {THREE.AnimationClip | null}
   */
  public get activeAnimation() { return this._clips[this._activeAnimationIdx] ?? null; }

  /**
   * An index of the animation currently playing.
   * @type {number}
   * @readonly
   */
  public get activeAnimationIndex() { return this._activeAnimationIdx; }

  /**
   * An boolean value indicating whether the animations are paused
   * @type {boolean}
   * @readonly
   */
  public get paused() { return this._mixer.timeScale === 0; }

  /**
   * Create new ModelAnimator instance
   */
  public constructor(root: THREE.Object3D) {
    this._mixer = new THREE.AnimationMixer(root);
    this._clips = [];
    this._actions = [];
    this._activeAnimationIdx = -1;
  }

  /**
   * Store the given clips
   * @param clips Three.js {@link https://threejs.org/docs/#api/en/animation/AnimationClip AnimationClip}s of the model
   * @returns {void}
   * @example
   * ```ts
   * // After loading model
   * view3d.animator.setClips(model.animations);
   * ```
   */
  public setClips(clips: THREE.AnimationClip[]): void {
    const mixer = this._mixer;
    this._clips = clips;
    this._actions = clips.map(clip => {
      const action = mixer.clipAction(clip);

      action.setEffectiveWeight(0);

      return action;
    });
  }

  /**
   * Play one of the model's animation
   * @param {number} index Index of the animation to play
   * @returns {void}
   */
  public play(index: number): void {
    const action = this._actions[index];

    if (action) {
      this.stop(); // Stop all previous actions
      this._restoreTimeScale();

      action.setEffectiveTimeScale(1);
      action.setEffectiveWeight(1);
      action.play();

      this._activeAnimationIdx = index;
    }
  }

  /**
   * Crossfade animation from one to another
   * @param {number} index Index of the animation to crossfade to
   * @param {number} duration Duration of the crossfade animation, in milisec
   */
  public async crossFade(index: number, duration: number, {
    synchronize = false
  }: Partial<{
    synchronize: boolean;
  }> = {}) {
    const mixer = this._mixer;
    const actions = this._actions;
    const activeAnimationIdx = this._activeAnimationIdx;
    const endAction = actions[index];
    const startAction = actions[activeAnimationIdx] ?? endAction;

    this._restoreTimeScale();

    const doCrossfade = () => {
      endAction.enabled = true;
      endAction.setEffectiveTimeScale(1);
      endAction.setEffectiveWeight(1);
      endAction.time = 0;
      endAction.play();
      startAction.crossFadeTo(endAction, duration / 1000, true);
      this._activeAnimationIdx = index;
    };

    if (synchronize) {
      const onLoop: THREE.EventListener<THREE.Event, "loop", THREE.AnimationMixer> = evt => {
        if (evt.action === startAction) {
          mixer.removeEventListener("loop", onLoop);

          doCrossfade();
        }
      };

      mixer.addEventListener("loop", onLoop);
    } else {
      doCrossfade();
    }
  }

  /**
   * Fadeout active animation, and restore to the default pose
   * @param {number} duration Duration of the crossfade animation, in milisec
   */
  public fadeOut(duration: number) {
    const actions = this._actions;
    const activeAction = actions[this._activeAnimationIdx];

    if (!activeAction) return;

    this._restoreTimeScale();
    activeAction.fadeOut(duration / 1000);
    this._activeAnimationIdx = -1;
  }

  /**
   * Pause all animations
   * If you want to stop animation completely, you should call {@link ModelAnimator#stop stop} instead
   * You should call {@link ModelAnimator#resume resume} to resume animation
   * @returns {void}
   */
  public pause(): void {
    this._mixer.timeScale = 0;
  }

  /**
   * Resume all animations
   * This will play animation from the point when the animation is paused
   * @returns {void}
   */
  public resume(): void {
    this._restoreTimeScale();
  }

  /**
   * Fully stops one of the model's animation
   * @returns {void}
   */
  public stop(): void {
    this._actions.forEach(action => {
      action.stop();
      action.setEffectiveWeight(0);
    });

    this._activeAnimationIdx = -1;
  }

  /**
   * Update animations
   * @param {number} delta number of seconds to play animations attached
   * @internal
   * @returns {void}
   */
  public update(delta: number): void {
    this._mixer.update(delta);
  }

  /**
   * Reset the instance and remove all cached animation clips attached to it
   * @returns {void}
   */
  public reset(): void {
    const mixer = this._mixer;

    this.stop();
    mixer.uncacheRoot(mixer.getRoot());

    this._clips = [];
    this._actions = [];
  }

  private _restoreTimeScale() {
    this._mixer.timeScale = 1;
  }
}

export default ModelAnimator;
