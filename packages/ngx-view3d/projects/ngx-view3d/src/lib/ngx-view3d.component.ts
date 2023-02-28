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
  NgZone,
} from "@angular/core";
import { isPlatformServer } from "@angular/common";
import { fromEvent, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import VanillaView3D, {
  EVENTS,
  DEFAULT_CLASS,
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
import View3DInterface from "./View3DInterface";
import { optionNames, setterNames } from "./const";

@Component({
  selector: "ngx-view3d, [NgxView3D]",
  template: `
    <canvas #canvas [ngClass]="_canvasElClass"></canvas>
    <ng-content></ng-content>
  `,
  host: {
    style: "display: block;",
    class: "view3d-wrapper"
  },
  inputs: [
    "opt-src: src",
    "opt-iosSrc: iosSrc",
    "opt-variant: variant",
    "opt-dracoPath: dracoPath",
    "opt-ktxPath: ktxPath",
    "opt-meshoptPath: meshoptPath",
    "opt-fixSkinnedBbox: fixSkinnedBbox",
    "opt-fov: fov",
    "opt-center: center",
    "opt-yaw: yaw",
    "opt-pitch: pitch",
    "opt-pivot: pivot",
    "opt-initialZoom: initialZoom",
    "opt-rotate: rotate",
    "opt-translate: translate",
    "opt-zoom: zoom",
    "opt-autoplay: autoplay",
    "opt-scrollable: scrollable",
    "opt-wheelScrollable: wheelScrollable",
    "opt-useGrabCursor: useGrabCursor",
    "opt-ignoreCenterOnFit: ignoreCenterOnFit",
    "opt-skybox: skybox",
    "opt-envmap: envmap",
    "opt-background: background",
    "opt-exposure: exposure",
    "opt-shadow: shadow",
    "opt-skyboxBlur: skyboxBlur",
    "opt-toneMapping: toneMapping",
    "opt-useDefaultEnv: useDefaultEnv",
    "opt-defaultAnimationIndex: defaultAnimationIndex",
    "opt-animationRepeatMode: animationRepeatMode",
    "opt-annotationURL: annotationURL",
    "opt-annotationWrapper: annotationWrapper",
    "opt-annotationSelector: annotationSelector",
    "opt-annotationBreakpoints: annotationBreakpoints",
    "opt-annotationAutoUnfocus: annotationAutoUnfocus",
    "opt-webAR: webAR",
    "opt-sceneViewer: sceneViewer",
    "opt-quickLook: quickLook",
    "opt-arPriority: arPriority",
    "opt-poster: poster",
    "opt-canvasSelector: canvasSelector",
    "opt-autoInit: autoInit",
    "opt-autoResize: autoResize",
    "opt-useResizeObserver: useResizeObserver",
    "opt-maintainSize: maintainSize",
    "opt-on: on",
    "opt-plugins: plugins",
    "opt-maxDeltaTime: maxDeltaTime"
  ]
})
export class NgxView3DComponent extends View3DInterface
  implements AfterViewInit, OnDestroy, OnChanges {
  @Input() public canvasClass!: string;

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

  @ViewChild("canvas") public canvas!: ElementRef<HTMLCanvasElement>;

  public get element() { return this._elRef.nativeElement; }
  public get _canvasElClass() { return `${DEFAULT_CLASS.CANVAS} ${this.canvasClass ?? ""}`.trim(); }
  private _destroy$ = new Subject<void>();

  public constructor(
    private _elRef: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private _platformId: any,
    private _ngZone: NgZone
  ) {
    super();
    this._view3D = null;
  }

  public ngAfterViewInit() {
    if (isPlatformServer(this._platformId)) return;

    const container = this._elRef.nativeElement;
    const options = this._getOptions();

    this._view3D = this._ngZone.runOutsideAngular(
      () => new VanillaView3D(container, options)
    );

    this._bindEvents();
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._view3D?.destroy();
  }

  public ngOnChanges(changes: SimpleChanges) {
    const view3D = this._view3D;
    if (!view3D) return;

    setterNames.forEach(name => {
      const changed = changes[`opt-${name}`];
      if (!changed) return;

      const oldProp = changed.previousValue;
      const newProp = changed.currentValue;

      if (newProp !== oldProp) {
        (view3D as any)[name] = newProp;
      }
    });
  }

  private _getOptions() {
    return optionNames.reduce((options, name) => {
      (options as any)[name] = (this as any)[`opt-${name}`];
      return options;
    }, {}) as View3DOptions;
  }

  private _bindEvents() {
    const view3D = this._view3D!;

    Object.keys(EVENTS).forEach(evtKey => {
      const evtName = (EVENTS as any)[evtKey];

      fromEvent(view3D, evtName)
        .pipe(takeUntil(this._destroy$))
        .subscribe((event: any) => {
          const emitter = (this as any)[`${evtName}Emitter`];
          if (emitter && emitter.observers.length > 0) {
            event.currentTarget = this;
            this._ngZone.run(() => emitter.emit(event));
          }
        });
    });
  }
}
