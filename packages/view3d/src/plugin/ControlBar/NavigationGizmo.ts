/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import * as THREE from "three";

import View3D from "../../View3D";
import { Pose } from "../../core";
import * as DEFAULT from "../../const/default";
import * as BROWSER from "../../const/browser";
import { EVENTS } from "../../const/external";
import { range } from "../../utils";

import ControlBar from "./ControlBar";
import ControlBarItem from "./ControlBarItem";

/**
 * @param {number} [strokeWidth=5] Width of the axis
 * @param {string} [font="14px sans-serif"] Font of the axis text
 * @param {number | string} [xAxisColor="ef2746"] Color of the X-axis
 * @param {number | string} [yAxisColor="a7c031"] Color of the Y-axis
 * @param {number | string} [zAxisColor="6571a6"] Color of the Z-axis
 */
export interface NavigationGizmoOptions {
  axisWidth: number;
  font: string;
  xAxisColor: number | string;
  yAxisColor: number | string;
  zAxisColor: number | string;
}

/**
 * Show navigation gizmos, use with ControlBar
 */
class NavigationGizmo implements ControlBarItem {
  public axisWidth: NavigationGizmoOptions["axisWidth"];
  public font: NavigationGizmoOptions["font"];
  public xAxisColor: NavigationGizmoOptions["xAxisColor"];
  public yAxisColor: NavigationGizmoOptions["yAxisColor"];
  public zAxisColor: NavigationGizmoOptions["zAxisColor"];

  public get element() { return this._rootEl; }
  public get enabled() { return this._enabled; }

  private _view3D: View3D;
  private _rootEl: HTMLElement;
  private _canvasEl: HTMLCanvasElement;
  private _axisEls: HTMLElement[];
  private _axisClickListeners: Array<() => void>;
  private _enabled: boolean;
  private _ctx: CanvasRenderingContext2D | null;
  private _canvasSize: THREE.Vector2;

  /** */
  public constructor(view3D: View3D, controlBar: ControlBar, {
    axisWidth = 5,
    font = "14px sans-serif",
    xAxisColor = "#ef2746",
    yAxisColor = "#a7c031",
    zAxisColor = "#6571a6"
  }: Partial<NavigationGizmoOptions> = {}) {
    this.axisWidth = axisWidth;
    this.font = font;
    this.xAxisColor = xAxisColor;
    this.yAxisColor = yAxisColor;
    this.zAxisColor = zAxisColor;

    this._view3D = view3D;
    this._createElement(controlBar);
    this._ctx = this._canvasEl.getContext("2d");
    this._enabled = false;
    this._canvasSize = new THREE.Vector2();
  }

  /**
   * Enable control item
   */
  public enable() {
    if (this._enabled || !this._ctx) return;

    const root = this._rootEl;
    const canvas = this._canvasEl;
    const view3D = this._view3D;

    this._enabled = true;
    view3D.rootEl.appendChild(root);
    view3D.on(EVENTS.RENDER, this._onRender);

    this._canvasSize.set(
      canvas.clientWidth,
      canvas.clientHeight
    );

    canvas.width = this._canvasSize.x;
    canvas.height = this._canvasSize.y;

    const poses = [
      new Pose(-90, 0, 0),
      new Pose(0, 90, 0),
      new Pose(0, 0, 0),
      new Pose(90, 0, 0),
      new Pose(0, -90, 0),
      new Pose(180, 0, 0)
    ];

    poses.forEach(pose => {
      pose.pivot.copy(view3D.camera.defaultPose.pivot);
    });

    this._axisClickListeners = this._axisEls.map((el, idx) => {
      const targetPose = poses[idx];
      const listener = () => {
        void view3D.camera.reset(DEFAULT.ANIMATION_DURATION, DEFAULT.EASING, targetPose);
      };

      el.addEventListener(BROWSER.EVENTS.CLICK, listener);

      return listener;
    });
  }

  /**
   * Disable control item
   */
  public disable() {
    if (!this._enabled) return;

    this._enabled = false;

    const root = this._view3D.rootEl;
    const element = this._rootEl;

    if (element && element.parentElement === root) {
      root.removeChild(element);
    }

    this._view3D.off(EVENTS.RENDER, this._onRender);
    this._axisEls.forEach((el, idx) => {
      const listener = this._axisClickListeners[idx];

      el.removeEventListener(BROWSER.EVENTS.CLICK, listener);
    });

    this._axisClickListeners = [];
  }

  /**
   *
   */
  private _onRender = () => {
    const view3D = this._view3D;
    const ctx = this._ctx;
    const canvasSize = this._canvasSize;
    const camera = view3D.camera.threeCamera;

    if (!ctx || !view3D.model) return;

    ctx.clearRect(0, 0, canvasSize.x, canvasSize.y);

    const quat = camera.quaternion.clone();
    quat.invert();

    const xPos = new THREE.Vector3(1, 0, 0).applyQuaternion(quat);
    const yPos = new THREE.Vector3(0, 1, 0).applyQuaternion(quat);
    const zPos = new THREE.Vector3(0, 0, 1).applyQuaternion(quat);

    const center = new THREE.Vector2(0.5, 0.5).multiply(canvasSize);
    ctx.lineCap = "round";
    ctx.lineWidth = this.axisWidth;

    const xColor = new THREE.Color(this.xAxisColor);
    const yColor = new THREE.Color(this.yAxisColor);
    const zColor = new THREE.Color(this.zAxisColor);

    // Sorted by distance, ASC
    const axisPositions = [{
      idx: 0,
      axis: "X",
      color: xColor,
      pos: xPos,
      negative: false
    }, {
      idx: 1,
      axis: "Y",
      color: yColor,
      pos: yPos,
      negative: false
    }, {
      idx: 2,
      axis: "Z",
      color: zColor,
      pos: zPos,
      negative: false
    }, {
      idx: 3,
      axis: "X",
      color: xColor,
      pos: xPos.clone().negate(),
      negative: true
    }, {
      idx: 4,
      axis: "Y",
      color: yColor,
      pos: yPos.clone().negate(),
      negative: true
    }, {
      idx: 5,
      axis: "Z",
      color: zColor,
      pos: zPos.clone().negate(),
      negative: true
    }].sort((a, b) => a.pos.z - b.pos.z);

    axisPositions.forEach(({ axis, pos, color, negative, idx }, renderIdx) => {
      const screenPos = this._getScreenPos(pos);
      const alpha = pos.z >= 0 ? 1 : 0.6;
      const colorRGBA = this._getColorRGBAString(color, alpha);

      if (!negative) {
        ctx.strokeStyle = colorRGBA;
        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(screenPos.x, screenPos.y);
        ctx.stroke();

        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.ellipse(screenPos.x, screenPos.y, 10, 10, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
      }

      ctx.fillStyle = colorRGBA;
      ctx.beginPath();
      ctx.ellipse(screenPos.x, screenPos.y, 10, 10, 0, 0, 2 * Math.PI);
      ctx.fill();

      if (!negative) {
        ctx.font = this.font;
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(axis, screenPos.x, screenPos.y);
      }

      const axisEl = this._axisEls[idx];
      axisEl.style.left = `${screenPos.x}px`;
      axisEl.style.top = `${screenPos.y}px`;
      axisEl.style.zIndex = renderIdx.toString();
    });
  };

  private _createElement(controlBar: ControlBar) {
    const root = document.createElement(BROWSER.EL_DIV);
    const canvas = document.createElement("canvas");
    const axisEls = range(6).map(() => document.createElement(BROWSER.EL_DIV));
    const className = {
      ...controlBar.className,
      ...ControlBar.DEFAULT_CLASS
    };

    root.classList.add(className.GIZMO_ROOT);
    root.appendChild(canvas);

    axisEls.forEach(el => {
      el.classList.add(className.GIZMO_AXIS);
      root.appendChild(el);
    });

    this._rootEl = root;
    this._canvasEl = canvas;
    this._axisEls = axisEls;
  }

  private _getScreenPos(pos: THREE.Vector3) {
    const canvasSize = this._canvasSize;
    const screenPos = new THREE.Vector2(pos.x, -pos.y)
      .multiplyScalar(0.8)
      .addScalar(1)
      .multiplyScalar(0.5)
      .multiply(canvasSize);

    return screenPos;
  }

  private _getColorRGBAString(color: THREE.Color, alpha: number) {
    return `rgba(${Math.floor(color.r * 255)},${Math.floor(color.g * 255)},${Math.floor(color.b * 255)},${alpha})`;
  }
}

export default NavigationGizmo;
