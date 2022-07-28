/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import View3D from "../View3D";
import CloseIcon from "../asset/close-icon";
import { EVENTS } from "../const/external";
import * as BROWSER from "../const/browser";
import { range } from "../utils";

import View3DPlugin from "./View3DPlugin";

/**
 * Options for the {@link AROverlay}
 * @interface
 * @param {AROverlay.DEFAULT_CLASS} [className={}] Override default class names
 * @param {boolean} [showPlaneDetection=true] Whether to show plane detection icon / toast before placing the model
 * @param {string} [toastText="Point your device downwards to find the ground and move it around."] Toast text
 */
export interface AROverlayOptions {
  className: Partial<{ -readonly [key in keyof typeof AROverlay.DEFAULT_CLASS]: string }>;
  showPlaneDetection: boolean;
  toastText: string;
}

/**
 * An UI that will be displayed on top of {@link WebARSession}.
 * This will be automatically added on the overlayRoot of the {@link WebARSession}.
 */
class AROverlay implements View3DPlugin {
  /**
   * Default class names that AROverlay uses
   * @type {object}
   * @property {"view3d-ar-root"} ROOT A class name for the root element of AROverlay
   * @property {"view3d-ar-close"} CLOSE_BUTTON A class name for the close button element
   * @property {"view3d-ar-detection"} DETECTION_ROOT A class name for the root element of floor detection annotator
   * @property {"view3d-ar-detection-icon"} DETECTION_ICON A class name for the wrapper element of floor detection icon
   * @property {"view3d-ar-detection-toast"} DETECTION_TOAST A class name for the toast element of floor detection annotator
   * @property {"view3d-ar-phone"} DETECTION_PHONE A class name for the root element of floor detection phone shape
   * @property {"view3d-ar-cube"} DETECTION_CUBE A class name for the root element of floor detection cube
   * @property {"view3d-ar-cube-face"} DETECTION_CUBE_FACE A class name for the face elements of floor detection cube
   * @property {"view3d-ar-plane"} DETECTION_PLANE A class name for the face elements of floor detection plane
   */
  public static readonly DEFAULT_CLASS = {
    ROOT: "view3d-ar-root",
    CLOSE_BUTTON: "view3d-ar-close",
    DETECTION_ROOT: "view3d-ar-detection",
    DETECTION_ICON: "view3d-ar-detection-icon",
    DETECTION_TOAST: "view3d-ar-detection-toast",
    DETECTION_PHONE: "view3d-ar-phone",
    DETECTION_CUBE: "view3d-ar-cube",
    DETECTION_CUBE_FACE: "view3d-ar-cube-face",
    DETECTION_PLANE: "view3d-ar-plane",
    DETECTION_VISIBLE: "visible"
  } as const;

  public className: AROverlayOptions["className"];
  public showPlaneDetection: AROverlayOptions["showPlaneDetection"];
  public toastText: AROverlayOptions["toastText"];

  private _rootEl: HTMLElement;
  private _closeButtonEl: HTMLElement;
  private _detectionRootEl: HTMLElement | null;

  /**
   * Create new instance of AROverlay
   * @param {object} [options={}] Options for the AROverlay
   */
  public constructor({
    className = {},
    showPlaneDetection = true,
    toastText = "Point your device downwards to find the ground and move it around."
  }: Partial<AROverlayOptions> = {}) {
    this.className = className;
    this.showPlaneDetection = showPlaneDetection;
    this.toastText = toastText;
    this._createElements();
  }

  public async init(view3D: View3D) {
    const rootEl = this._rootEl;
    const detectionRoot = this._detectionRootEl;
    const closeButton = this._closeButtonEl;

    const className = {
      ...AROverlay.DEFAULT_CLASS,
      ...this.className
    };

    view3D.on(EVENTS.AR_START, ({ session }) => {
      const overlayRoot = session.domOverlay.root;

      if (!overlayRoot) return;

      overlayRoot.appendChild(rootEl);

      const closeButtonHandler = () => {
        void session.exit();
      };

      detectionRoot?.classList.add(className.DETECTION_VISIBLE);
      const onPlacedHandler = () => {
        detectionRoot?.classList.remove(className.DETECTION_VISIBLE);
      };

      view3D.once(EVENTS.AR_MODEL_PLACED, onPlacedHandler);

      closeButton.addEventListener(BROWSER.EVENTS.CLICK, closeButtonHandler);
      view3D.once(EVENTS.AR_END, () => {
        if (rootEl.parentElement) {
          rootEl.parentElement.removeChild(rootEl);
        }
        closeButton.removeEventListener(BROWSER.EVENTS.CLICK, closeButtonHandler);
        view3D.off(EVENTS.AR_MODEL_PLACED, onPlacedHandler);
      });
    });
  }

  public teardown() {
    // DO NOTHING
  }

  private _createElements() {
    const className = {
      ...AROverlay.DEFAULT_CLASS,
      ...this.className
    };

    const root = document.createElement(BROWSER.EL_DIV);
    const closeButton = document.createElement(BROWSER.EL_DIV);

    closeButton.classList.add(className.CLOSE_BUTTON);
    closeButton.innerHTML = CloseIcon;

    root.classList.add(className.ROOT);
    root.appendChild(closeButton);

    if (this.showPlaneDetection) {
      this._detectionRootEl = this._createPlaneDetectionElements();
      root.appendChild(this._detectionRootEl);
    }

    this._rootEl = root;
    this._closeButtonEl = closeButton;
  }

  private _createPlaneDetectionElements() {
    const className = {
      ...AROverlay.DEFAULT_CLASS,
      ...this.className
    };
    const detectionRoot = document.createElement(BROWSER.EL_DIV);
    const detectionIcon = document.createElement(BROWSER.EL_DIV);
    const detectionLabel = document.createElement(BROWSER.EL_DIV);
    const detectionPhone = document.createElement(BROWSER.EL_DIV);
    const detectionCube = document.createElement(BROWSER.EL_DIV);
    const detectionPlane = document.createElement(BROWSER.EL_DIV);
    const cubeFaces = range(5).map(() => document.createElement(BROWSER.EL_DIV));

    detectionRoot.classList.add(className.DETECTION_ROOT);
    detectionIcon.classList.add(className.DETECTION_ICON);
    detectionLabel.classList.add(className.DETECTION_TOAST);
    detectionPhone.classList.add(className.DETECTION_PHONE);
    detectionCube.classList.add(className.DETECTION_CUBE);
    detectionPlane.classList.add(className.DETECTION_PLANE);

    detectionLabel.innerHTML = this.toastText;

    cubeFaces.forEach(face => {
      face.classList.add(className.DETECTION_CUBE_FACE);
      detectionCube.appendChild(face);
    });
    detectionIcon.appendChild(detectionPhone);
    detectionIcon.appendChild(detectionCube);
    detectionIcon.appendChild(detectionPlane);
    detectionRoot.appendChild(detectionIcon);
    detectionRoot.appendChild(detectionLabel);

    return detectionRoot;
  }
}

export default AROverlay;
