/*
 * Copyright (c) 2015 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import View3D from "../View3D";

/**
 * Event that fires when View3D is initialized
 * This will be called once after the first 3D model is loaded
 * @ko View3D가 초기화되었을 때 발생하는 이벤트
 * 이 이벤트는 첫번째 3D 모델이 로드된 직후 1회만 트리거됩니다
 * @event View3D#ready
 * @type {object}
 * @property {View3D} target A View3D instance that triggered this event<ko>이 이벤트를 트리거한 View3D의 인스턴스</ko>
 */
export interface ReadyEvent {
  target: View3D;
}

/**
 * Event that fires when the 3D model is loaded
 * @ko 3D 모델이 로드되었을 때 발생하는 이벤트
 * @event View3D#load
 * @type {object}
 * @property {View3D} target A View3D instance that triggered this event<ko>이 이벤트를 트리거한 View3D의 인스턴스</ko>
 */
export interface LoadEvent {
  target: View3D;
}

/**
 * Event that fires when View3D's {@link View3D#resize resize()} is called
 * @ko View3D의 {@link View3D#resize resize())}가 호출되었을 때 발생하는 이벤트
 * @event View3D#resize
 * @type {object}
 * @property {View3D} target A View3D instance that triggered this event<ko>이 이벤트를 트리거한 View3D의 인스턴스</ko>
 * @property {number} width New width of the canvas<ko>업데이트된 캔버스 너비</ko>
 * @property {number} height New height of the canvas<ko>업데이트된 캔버스 높이</ko>
 */
export interface ResizeEvent {
  target: View3D;
  width: number;
  height: number;
}

/**
 * Event that fires before rendering a frame
 * @ko 프레임 렌더링 직전 발생하는 이벤트
 * @event View3D#beforeRender
 * @type {object}
 * @property {View3D} target A View3D instance that triggered this event<ko>이 이벤트를 트리거한 View3D의 인스턴스</ko>
 */
export interface BeforeRenderEvent {
  target: View3D;
}

/**
 * Event that fires after rendering a frame
 * @ko 프레임 렌더링 직후 발생하는 이벤트
 * @event View3D#afterRender
 * @type {object}
 * @property {View3D} target A View3D instance that triggered this event<ko>이 이벤트를 트리거한 View3D의 인스턴스</ko>
 */
export interface AfterRenderEvent {
  target: View3D;
}
