/*
 * Copyright (c) 2015 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import View3D from "../View3D";
import Model from "../core/Model";
import WebARSession from "../xr/WebARSession";

/**
 * An event that fires when View3D is initialized
 * This will be called once after the first 3D model is loaded
 * @event View3D#ready
 * @type {object}
 * @property {View3D} target An instance of View3D that triggered this event
 */
export interface ReadyEvent {
  target: View3D;
}

/**
 * An event that fires when the 3D model is loaded but not displayed yet
 * @event View3D#load
 * @type {object}
 * @property {View3D} target An instance of View3D that triggered this event
 * @property {Model} model A new model that loaded
 */
export interface LoadEvent {
  target: View3D;
  model: Model;
}

/**
 * An event that fires when the 3D Model is loaded and displayed on the canvas
 * @event View3D#modelChange
 * @type {object}
 * @property {View3D} target An instance of View3D that triggered this event
 * @property {Model} model A new model that displayed
 */
export interface ModelChangeEvent {
  target: View3D;
  model: Model;
}

/**
 * An event that fires when View3D's {@link View3D#resize resize()} is called
 * @event View3D#resize
 * @type {object}
 * @property {View3D} target An instance of View3D that triggered this event
 * @property {number} width New width of the canvas
 * @property {number} height New height of the canvas
 */
export interface ResizeEvent {
  target: View3D;
  width: number;
  height: number;
}

/**
 * An event that fires before rendering a frame
 * @event View3D#beforeRender
 * @type {object}
 * @property {View3D} target An instance of View3D that triggered this event
 */
export interface BeforeRenderEvent {
  target: View3D;
}

/**
 * An event that fires after rendering a frame
 * @event View3D#afterRender
 * @type {object}
 * @property {View3D} target An instance of View3D that triggered this event
 */
export interface RenderEvent {
  target: View3D;
}

/**
 * An event that fires while the 3D model is loading.
 * This extends the native {@link https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent ProgressEvent}
 * To get `total` bytes, you should serve the 3D model with the `Content-Length` header.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent
 * @event View3D#progress
 * @type {object}
 * @property {View3D} target An instance of View3D that triggered this event
 * @property {boolean} lengthComputable A boolean flag indicating if the total work to be done, and the amount of work already done, by the underlying process is calculable. In other words, it tells if the progress is measurable or not.
 * @property {number} loaded A 64-bit unsigned integer value indicating the amount of work already performed by the underlying process. The ratio of work done can be calculated by dividing total by the value of this property. When downloading a resource using HTTP, this only counts the body of the HTTP message, and doesn't include headers and other overhead.
 * @property {number} total A 64-bit unsigned integer representing the total amount of work that the underlying process is in the progress of performing. When downloading a resource using HTTP, this is the Content-Length (the size of the body of the message), and doesn't include the headers and other overhead.
 */
export interface LoadProgressEvent extends Omit<ProgressEvent, "target"> {
  target: View3D;
  lengthComputable: boolean;
  loaded: number;
  total: number;
}

/**
 * An event that fires when user clicked the Apple pay button or custom action button
 * @see https://developer.apple.com/documentation/arkit/adding_an_apple_pay_button_or_a_custom_action_in_ar_quick_look#3405186
 * @event View3D#quickLookTap
 * @type {Event}
 */
export interface QuickLookTapEvent extends Omit<Event, "target"> {
  target: View3D;
}

/**
 * Emitted when session is started.
 * @event View3D#arStart
 * @type {object}
 * @property {View3D} target An instance of View3D that triggered this event
 * @property {WebARSession} session An instance of WebARSession that triggered this event
 */
export interface ARStartEvent {
  target: View3D;
  session: WebARSession;
}

/**
 * Emitted when session is ended.
 * @event View3D#arEnd
 * @type {object}
 * @property {View3D} target An instance of View3D that triggered this event
 * @property {WebARSession} session An instance of WebARSession that triggered this event
 */
export interface AREndEvent {
  target: View3D;
  session: WebARSession;
}

/**
 * Emitted when model is placed.
 * @event WebARSession#arModelPlaced
 * @type {object}
 * @property {View3D} target An instance of View3D that triggered this event
 * @property {WebARSession} session An instance of WebARSession that triggered this event
 * @property {Model} model The model placed
 */
export interface ARModelPlacedEvent {
  target: View3D;
  session: WebARSession;
  model: Model;
}
