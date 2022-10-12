/*
 * Copyright (c) 2015 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import View3D from "../View3D";
import Model from "../core/Model";
import Pose from "../core/Pose";
import Annotation from "../annotation/Annotation";
import { INPUT_TYPE } from "../const/external";
import WebARSession from "../xr/WebARSession";

import { ValueOf } from "./utils";

/**
 * An event that fires when View3D is initialized.
 * This will be called once after the first 3D model is loaded.
 * @event View3D#ready
 * @type {object}
 * @property {string} type A type of the event.
 * @property {View3D} target An instance of View3D that triggered this event.
 */
export interface ReadyEvent {
  type: string;
  target: View3D;
}

/**
 * An event that fires before loading a 3D model.
 * @event View3D#loadStart
 * @type {object}
 * @property {string} type A type of the event.
 * @property {View3D} target An instance of View3D that triggered this event.
 * @property {string} src A source URL of the model to load.
 * @property {number} level A level of model when loading multiple models at once, an integer starting from 0.
 * @property {number} maxLevel Maximum level of models loading.
 */
export interface LoadStartEvent {
  type: string;
  target: View3D;
  src: string;
  level: number;
  maxLevel: number;
}

/**
 * An event that fires when the 3D model is loaded but not displayed yet.
 * @event View3D#load
 * @type {object}
 * @property {string} type A type of the event.
 * @property {View3D} target An instance of View3D that triggered this event.
 * @property {Model} model A new model that loaded.
 * @property {number} level A level of model when loading multiple models at once, an integer starting from 0.
 * @property {number} maxLevel Maximum level of models loading.
 */
export interface LoadEvent {
  type: string;
  target: View3D;
  model: Model;
  level: number;
  maxLevel: number;
}

/**
 * An event that fires when the 3D model fails to load / parse
 * @event View3D#loadError
 * @type {object}
 * @property {string} type A type of the event.
 * @property {View3D} target An instance of View3D that triggered this event.
 * @property {number} level A level of model when loading multiple models at once, an integer starting from 0.
 * @property {number} maxLevel Maximum level of models loading.
 * @property {Error} error An actual error instance that throwed when loading/parsing the model.
 */
export interface LoadErrorEvent {
  type: string;
  target: View3D;
  level: number;
  maxLevel: number;
  error: Error;
}

/**
 * An event that fires when all assets in a single load sequence(i.e. View3D's init, load) are finished to load
 * @event View3D#loadFinish
 * @type {object}
 * @property {string} type A type of the event.
 * @property {View3D} target An instance of View3D that triggered this event.
 */
export interface LoadFinishEvent {
  type: string;
  target: View3D;
}

/**
 * An event that fires when the 3D Model is loaded and displayed on the canvas.
 * @event View3D#modelChange
 * @type {object}
 * @property {string} type A type of the event.
 * @property {View3D} target An instance of View3D that triggered this event.
 * @property {Model} model A new model that displayed.
 */
export interface ModelChangeEvent {
  type: string;
  target: View3D;
  model: Model;
}

/**
 * An event that fires when View3D's {@link View3D#resize resize()} is called
 * @event View3D#resize
 * @type {object}
 * @property {string} type A type of the event.
 * @property {View3D} target An instance of View3D that triggered this event.
 * @property {number} width New width of the canvas.
 * @property {number} height New height of the canvas.
 */
export interface ResizeEvent {
  type: string;
  target: View3D;
  width: number;
  height: number;
}

/**
 * An event that fires before rendering a frame.
 * @event View3D#beforeRender
 * @type {object}
 * @property {string} type A type of the event.
 * @property {View3D} target An instance of View3D that triggered this event.
 * @property {number} delta Time passed from the previous render call, in milisecond.
 */
export interface BeforeRenderEvent {
  type: string;
  target: View3D;
  delta: number;
}

/**
 * An event that fires after rendering a frame.
 * @event View3D#afterRender
 * @type {object}
 * @property {string} type A type of the event.
 * @property {View3D} target An instance of View3D that triggered this event.
 * @property {number} delta Time passed from the previous render call, in milisecond.
 */
export interface RenderEvent {
  type: string;
  target: View3D;
  delta: number;
}

/**
 * An event that fires while assets are loading.
 * This extends the native {@link https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent ProgressEvent}
 * To get `total` bytes, you should serve the 3D model with the `Content-Length` header.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent
 * @event View3D#progress
 * @type {object}
 * @property {string} type A type of the event.
 * @property {View3D} target An instance of View3D that triggered this event.
 * @property {string} src A source URL of the asset
 * @property {boolean} lengthComputable A boolean flag indicating if the total work to be done, and the amount of work already done, by the underlying process is calculable. In other words, it tells if the progress is measurable or not.
 * @property {number} loaded A 64-bit unsigned integer value indicating the amount of work already performed by the underlying process. The ratio of work done can be calculated by dividing total by the value of this property. When downloading a resource using HTTP, this only counts the body of the HTTP message, and doesn't include headers and other overhead.
 * @property {number} total A 64-bit unsigned integer representing the total amount of work that the underlying process is in the progress of performing. When downloading a resource using HTTP, this is the Content-Length (the size of the body of the message), and doesn't include the headers and other overhead.
 */
export interface LoadProgressEvent {
  type: string;
  target: View3D;
  src: string;
  lengthComputable: boolean;
  loaded: number;
  total: number;
}

/**
 * An event that fires at the start of every inputs
 * @event View3D#inputStart
 * @type {object}
 * @property {string} type A type of the event.
 * @property {View3D} target An instance of View3D that triggered this event.
 * @property {INPUT_TYPE} inputType Type of the input.
 */
export interface InputStartEvent {
  type: string;
  target: View3D;
  inputType: ValueOf<typeof INPUT_TYPE>;
}

/**
 * An event that fires at the end of every inputs
 * @event View3D#inputEnd
 * @type {object}
 * @property {string} type A type of the event.
 * @property {View3D} target An instance of View3D that triggered this event.
 * @property {INPUT_TYPE} inputType Type of the input.
 */
export interface InputEndEvent {
  type: string;
  target: View3D;
  inputType: ValueOf<typeof INPUT_TYPE>;
}

/**
 * An event that fires on every camera movement
 * @event View3D#cameraChange
 * @type {object}
 * @property {string} type A type of the event.
 * @property {View3D} target An instance of View3D that triggered this event.
 * @property {Pose} pose Current yaw, pitch, zoom, and pivot value
 * @property {Pose} prevPose Previous yaw, pitch, zoom, and pivot value
 */
export interface CameraChangeEvent {
  type: string;
  target: View3D;
  pose: Pose;
  prevPose: Pose;
}

/**
 * An event that fires on animation start
 * @event View3D#animationStart
 * @type {object}
 * @property {string} type A type of the event.
 * @property {View3D} target An instance of View3D that triggered this event.
 * @property {number} index An index of the animation.
 * @property {THREE.AnimationClip} clip An {@link https://threejs.org/docs/#api/en/animation/AnimationClip AnimationClip} instance of the animation.
 * @property {THREE.AnimationAction} action An {@link https://threejs.org/docs/#api/en/animation/AnimationAction AnimationAction} instance of the animation.
 */
export interface AnimationStartEvent {
  type: string;
  target: View3D;
  index: number;
  clip: THREE.AnimationClip;
  action: THREE.AnimationAction;
}

/**
 * An event that fires on single animation loop
 * @event View3D#animationLoop
 * @type {object}
 * @property {string} type A type of the event.
 * @property {View3D} target An instance of View3D that triggered this event.
 * @property {number} index An index of the animation.
 * @property {THREE.AnimationClip} clip An {@link https://threejs.org/docs/#api/en/animation/AnimationClip AnimationClip} instance of the animation.
 * @property {THREE.AnimationAction} action An {@link https://threejs.org/docs/#api/en/animation/AnimationAction AnimationAction} instance of the animation.
 */
export interface AnimationLoopEvent {
  type: string;
  target: View3D;
  index: number;
  clip: THREE.AnimationClip;
  action: THREE.AnimationAction;
}

/**
 * An event that fires on animation finish
 * @event View3D#animationFinished
 * @type {object}
 * @property {string} type A type of the event.
 * @property {View3D} target An instance of View3D that triggered this event.
 * @property {number} index An index of the animation.
 * @property {THREE.AnimationClip} clip An {@link https://threejs.org/docs/#api/en/animation/AnimationClip AnimationClip} instance of the animation.
 * @property {THREE.AnimationAction} action An {@link https://threejs.org/docs/#api/en/animation/AnimationAction AnimationAction} instance of the animation.
 */
export interface AnimationFinishedEvent {
  type: string;
  target: View3D;
  index: number;
  clip: THREE.AnimationClip;
  action: THREE.AnimationAction;
}

/**
 * An event that fires on annotation focus
 * @event View3D#annotationFocus
 * @type {object}
 * @property {string} type A type of the event.
 * @property {View3D} target An instance of View3D that triggered this event.
 * @property {Annotation} annotation An instance of the annotation that triggered this event.
 */
export interface AnnotationFocusEvent {
  type: string;
  target: View3D;
  annotation: Annotation;
}

/**
 * An event that fires on annotation unfocus
 * @event View3D#annotationUnfocus
 * @type {object}
 * @property {string} type A type of the event.
 * @property {View3D} target An instance of View3D that triggered this event.
 * @property {Annotation} annotation An instance of the annotation that triggered this event.
 */
export interface AnnotationUnfocusEvent {
  type: string;
  target: View3D;
  annotation: Annotation;
}

/**
 * Emitted when {@link WebARSession} is started.
 * Not available in SceneViewer or AR Quick Look.
 * @event View3D#arStart
 * @type {object}
 * @property {string} type A type of the event.
 * @property {View3D} target An instance of View3D that triggered this event.
 * @property {WebARSession} session An instance of WebARSession that triggered this event.
 */
export interface ARStartEvent {
  type: string;
  target: View3D;
  session: WebARSession;
}

/**
 * Emitted when {@link WebARSession} is ended.
 * Not available in SceneViewer or AR Quick Look.
 * @event View3D#arEnd
 * @type {object}
 * @property {string} type A type of the event.
 * @property {View3D} target An instance of View3D that triggered this event.
 * @property {WebARSession} session An instance of WebARSession that triggered this event.
 */
export interface AREndEvent {
  type: string;
  target: View3D;
  session: WebARSession;
}

/**
 * Emitted when model is placed in {@link WebARSession}.
 * Not available in SceneViewer or AR Quick Look.
 * @event View3D#arModelPlaced
 * @type {object}
 * @property {string} type A type of the event.
 * @property {View3D} target An instance of View3D that triggered this event.
 * @property {WebARSession} session An instance of WebARSession that triggered this event.
 * @property {Model} model A model placed.
 */
export interface ARModelPlacedEvent {
  type: string;
  target: View3D;
  session: WebARSession;
  model: Model;
}

/**
 * An event that fires when user clicked the Apple pay button or custom action button
 * @see https://developer.apple.com/documentation/arkit/adding_an_apple_pay_button_or_a_custom_action_in_ar_quick_look#3405186
 * @event View3D#quickLookTap
 * @type {Event}
 * @property {string} type A type of the event.
 * @property {View3D} target An instance of View3D that triggered this event.
 */
export interface QuickLookTapEvent extends Omit<Event, "target"> {
  type: string;
  target: View3D;
}
