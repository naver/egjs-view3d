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
  View3DOptions,
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
  QuickLookTapEvent
} from "@egjs/view3d";

const view3DSetterNames = Object.getOwnPropertyNames(VanillaView3D.prototype)
  .filter(name => {
    const descriptor = Object.getOwnPropertyDescriptor(VanillaView3D.prototype, name);

    if (name.startsWith("_")) return false;
    if (descriptor?.value) return false;

    return !!descriptor!.set;
  });

@Component({
  selector: "ngx-view3d, [NgxView3D]",
  template: `
    <canvas #canvas [ngClass]="_canvasElClass"></canvas>
    <ng-content></ng-content>
  `,
  host: {
    style: "display: block;",
    class: DEFAULT_CLASS.WRAPPER
  }
})
export class NgxView3DComponent
  implements AfterViewInit, OnDestroy, OnChanges {
  @Input() public canvasClass: string;
  @Input() public options: View3DOptions;

  @Output() public ready = new EventEmitter<ReadyEvent>();
  @Output() public loadStart = new EventEmitter<LoadStartEvent>();
  @Output() public load = new EventEmitter<LoadEvent>();
  @Output() public loadError = new EventEmitter<LoadErrorEvent>();
  @Output() public loadFinish = new EventEmitter<LoadFinishEvent>();
  @Output() public modelChange = new EventEmitter<ModelChangeEvent>();
  @Output() public resize = new EventEmitter<ResizeEvent>();
  @Output() public beforeRender = new EventEmitter<BeforeRenderEvent>();
  @Output() public render = new EventEmitter<RenderEvent>();
  @Output() public progress = new EventEmitter<ProgressEvent>();
  @Output() public inputStart = new EventEmitter<InputStartEvent>();
  @Output() public inputEnd = new EventEmitter<InputEndEvent>();
  @Output() public cameraChange = new EventEmitter<CameraChangeEvent>();
  @Output() public animationStart = new EventEmitter<AnimationStartEvent>();
  @Output() public animationLoop = new EventEmitter<AnimationLoopEvent>();
  @Output() public animationFinished = new EventEmitter<AnimationFinishedEvent>();
  @Output() public annotationFocus = new EventEmitter<AnnotationFocusEvent>();
  @Output() public annotationUnfocus = new EventEmitter<AnnotationUnfocusEvent>();
  @Output() public arStart = new EventEmitter<ARStartEvent>();
  @Output() public arEnd = new EventEmitter<AREndEvent>();
  @Output() public arModelPlaced = new EventEmitter<ARModelPlacedEvent>();
  @Output() public quickLookTap = new EventEmitter<QuickLookTapEvent>();

  @ViewChild("canvas") public canvas: ElementRef<HTMLCanvasElement>;

  public get element() { return this._elRef.nativeElement; }
  private get _canvasElClass() { return `${DEFAULT_CLASS.CANVAS} ${this.canvasClass ?? ""}`.trim(); }
  private _view3D: VanillaView3D;

  public constructor(
    private _elRef: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private _platformId
  ) {
    this._view3D = null;

    Object.keys(EVENTS).forEach(evtKey => {
      const evtName = EVENTS[evtKey];
      this[evtName] = new EventEmitter();
    });

    withMethods(this, "_view3D");
  }

  public ngAfterViewInit() {
    if (!isPlatformBrowser(this._platformId)) return;

    const container = this._elRef.nativeElement;
    const options = this.options;

    this._view3D = new VanillaView3D(container, options);

    this._bindEvents();
  }

  public ngOnDestroy() {
    this._view3D?.destroy();
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (!this._view3D || !changes.options) return;

    const prevProps = changes.options.previousValue;
    const newProps = changes.options.currentValue;

    view3DSetterNames.forEach(name => {
      const oldProp = prevProps[name];
      const newProp = newProps[name];

      if (newProp !== oldProp) {
        this._view3D[name] = newProp;
      }
    });
  }

  private _bindEvents() {
    const view3D = this._view3D;

    Object.keys(EVENTS).forEach(evtKey => {
      const evtName = EVENTS[evtKey];

      view3D.on(evtName, e => {
        const emitter = this[evtName];

        e.currentTarget = this;

        if (emitter) {
          emitter.emit(e);
        }
      });
    });
  }
}
