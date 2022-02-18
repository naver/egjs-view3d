/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";

import View3D from "../View3D";
import { EVENTS } from "../const/external";

/**
 * Component that manages animations of the 3D Model
 */
class ModelAnimator {
  private _view3D: View3D;
  private _mixer: THREE.AnimationMixer;
  private _clips: THREE.AnimationClip[];
  private _actions: THREE.AnimationAction[];
  private _activeAnimationIdx: number;
  private _fadePromises: Array<{
    listener: () => any;
    resolve: (value: boolean | PromiseLike<boolean>) => void;
  }>;

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
  public constructor(view3D: View3D) {
    this._view3D = view3D;
    this._mixer = new THREE.AnimationMixer(view3D.scene.userObjects);
    this._clips = [];
    this._actions = [];
    this._activeAnimationIdx = -1;
    this._fadePromises = [];
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

    if (!action) return;

    this.stop(); // Stop all previous actions
    this._restoreTimeScale();

    action.setEffectiveTimeScale(1);
    action.setEffectiveWeight(1);
    action.play();

    this._activeAnimationIdx = index;

    this._flushFadePromises();
  }

  /**
   * Crossfade animation from one to another
   * @param {number} index Index of the animation to crossfade to
   * @param {number} duration Duration of the crossfade animation, in milisec
   * @returns {Promise<boolean>} A promise that resolves boolean value that indicates whether the crossfade is fullfilled without any inference
   */
  public async crossFade(index: number, duration: number, {
    synchronize = false
  }: Partial<{
    synchronize: boolean;
  }> = {}): Promise<boolean> {
    const view3D = this._view3D;
    const mixer = this._mixer;
    const actions = this._actions;
    const activeAnimationIdx = this._activeAnimationIdx;
    const endAction = actions[index];
    const startAction = actions[activeAnimationIdx] ?? endAction;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const EVT_LOOP = "loop";

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
          mixer.removeEventListener(EVT_LOOP, onLoop);

          doCrossfade();
        }
      };

      mixer.addEventListener(EVT_LOOP, onLoop);
    } else {
      doCrossfade();
    }

    this._flushFadePromises();

    const fadePromise = new Promise<boolean>(resolve => {
      const onFrame = () => {
        if (endAction.getEffectiveWeight() < 1) return;

        view3D.off(EVENTS.BEFORE_RENDER, onFrame);
        resolve(true);
      };

      view3D.on(EVENTS.BEFORE_RENDER, onFrame);

      this._fadePromises.push({
        listener: onFrame,
        resolve
      });
    });

    return fadePromise;
  }

  /**
   * Fadeout active animation, and restore to the default pose
   * @param {number} duration Duration of the crossfade animation, in milisec
   * @returns {Promise<boolean>} A promise that resolves boolean value that indicates whether the fadeout is fullfilled without any inference
   */
  public async fadeOut(duration: number): Promise<boolean> {
    const view3D = this._view3D;
    const actions = this._actions;
    const activeAction = actions[this._activeAnimationIdx];

    if (!activeAction) return false;

    this._flushFadePromises();
    this._restoreTimeScale();
    activeAction.fadeOut(duration / 1000);
    this._activeAnimationIdx = -1;

    const fadePromise = new Promise<boolean>(resolve => {
      const onFrame = () => {
        if (activeAction.getEffectiveWeight() > 0) return;

        view3D.off(EVENTS.BEFORE_RENDER, onFrame);
        resolve(true);
      };

      view3D.on(EVENTS.BEFORE_RENDER, onFrame);

      this._fadePromises.push({
        listener: onFrame,
        resolve
      });
    });

    return fadePromise;
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
    this._flushFadePromises();
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

  private _flushFadePromises() {
    const view3D = this._view3D;
    const fadePromises = this._fadePromises;

    fadePromises.forEach(({ resolve, listener }) => {
      resolve(false);
      view3D.off(EVENTS.BEFORE_RENDER, listener);
    });

    this._fadePromises = [];
  }
}

export default ModelAnimator;
