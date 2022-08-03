/**
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
 import {
  Component,
  Input,
  AfterViewInit,
  ElementRef,
  OnChanges,
  Output,
  EventEmitter,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import VanillaView3D, {
  EVENTS,
  DEFAULT_CLASS,
  withMethods,
  ReadyEvent,
  LoadStartEvent,
  LoadEvent,
  LoadErrorEvent,
  LoadFinishEvent,
  ModelChangeEvent,
  ResizeEvent,
  BeforeRenderEvent,
  RenderEvent,
  InputStartEvent,
  InputEndEvent,
  CameraChangeEvent,
  AnimationStartEvent,
  AnimationLoopEvent,
  AnimationFinishedEvent,
  AnnotationFocusEvent,
  AnnotationUnfocusEvent,
  ARStartEvent,
  AREndEvent,
  ARModelPlacedEvent,
  QuickLookTapEvent,
  View3DOptions
} from "@egjs/view3d";
import { optionNames, optionInputs, setterNames } from "./const";

@Component({
  selector: "ngx-view3d, [NgxView3D]",
  template: `
    <canvas #canvas [ngClass]="_canvasElClass"></canvas>
    <ng-content></ng-content>
  `,
  host: {
    style: "display: block;",
    class: DEFAULT_CLASS.WRAPPER
  },
  inputs: optionInputs
})
export class NgxView3DComponent
  implements AfterViewInit, OnDestroy, OnChanges {
  @Input() public canvasClass: string;

  @Output("ready") public readyEmitter = new EventEmitter<ReadyEvent>();
  @Output("loadStart") public loadStartEmitter = new EventEmitter<LoadStartEvent>();
  @Output("load") public loadEmitter = new EventEmitter<LoadEvent>();
  @Output("loadError") public loadErrorEmitter = new EventEmitter<LoadErrorEvent>();
  @Output("loadFinish") public loadFinishEmitter = new EventEmitter<LoadFinishEvent>();
  @Output("modelChange") public modelChangeEmitter = new EventEmitter<ModelChangeEvent>();
  @Output("resize") public resizeEmitter = new EventEmitter<ResizeEvent>();
  @Output("beforeRender") public beforeRenderEmitter = new EventEmitter<BeforeRenderEvent>();
  @Output("render") public renderEmitter = new EventEmitter<RenderEvent>();
  @Output("progress") public progressEmitter = new EventEmitter<ProgressEvent>();
  @Output("inputStart") public inputStartEmitter = new EventEmitter<InputStartEvent>();
  @Output("inputEnd") public inputEndEmitter = new EventEmitter<InputEndEvent>();
  @Output("cameraChange") public cameraChangeEmitter = new EventEmitter<CameraChangeEvent>();
  @Output("animationStart") public animationStartEmitter = new EventEmitter<AnimationStartEvent>();
  @Output("animationLoop") public animationLoopEmitter = new EventEmitter<AnimationLoopEvent>();
  @Output("animationFinished") public animationFinishedEmitter = new EventEmitter<AnimationFinishedEvent>();
  @Output("annotationFocus") public annotationFocusEmitter = new EventEmitter<AnnotationFocusEvent>();
  @Output("annotationUnfocus") public annotationUnfocusEmitter = new EventEmitter<AnnotationUnfocusEvent>();
  @Output("arStart") public arStartEmitter = new EventEmitter<ARStartEvent>();
  @Output("arEnd") public arEndEmitter = new EventEmitter<AREndEvent>();
  @Output("arModelPlaced") public arModelPlacedEmitter = new EventEmitter<ARModelPlacedEvent>();
  @Output("quickLookTap") public quickLookTapEmitter = new EventEmitter<QuickLookTapEvent>();

  @ViewChild("canvas") public canvas: ElementRef<HTMLCanvasElement>;

  public get element() { return this._elRef.nativeElement; }
  private get _canvasElClass() { return `${DEFAULT_CLASS.CANVAS} ${this.canvasClass ?? ""}`.trim(); }
  private _view3D: VanillaView3D;

  public constructor(
    private _elRef: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private _platformId
  ) {
    this._view3D = null;

    withMethods(this, "_view3D");
  }

  public ngAfterViewInit() {
    if (!isPlatformBrowser(this._platformId)) return;

    const container = this._elRef.nativeElement;
    const options = this._getOptions();

    this._view3D = new VanillaView3D(container, options);

    this._bindEvents();
  }

  public ngOnDestroy() {
    this._view3D?.destroy();
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (!this._view3D) return;

    setterNames.forEach(name => {
      const changed = changes[`opt-${name}`];
      if (!changed) return;

      const oldProp = changed.previousValue;
      const newProp = changed.currentValue;

      if (newProp !== oldProp) {
        this._view3D[name] = newProp;
      }
    });
  }

  private _getOptions() {
    return optionNames.reduce((options, name) => {
      options[name] = this[`opt-${name}`];
      return options;
    }, {}) as View3DOptions;
  }

  private _bindEvents() {
    const view3D = this._view3D;

    Object.keys(EVENTS).forEach(evtKey => {
      const evtName = EVENTS[evtKey];

      view3D.on(evtName, e => {
        const emitter = this[`${evtName}Emitter`];

        e.currentTarget = this;

        if (emitter) {
          emitter.emit(e);
        }
      });
    });
  }
}
