/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import * as React from "react";
import VanillaView3D, {
  View3DOptions,
  withMethods,
  EVENTS,
  DEFAULT_CLASS
} from "@egjs/view3d";

import { View3DProps } from "./types";

type View3DPropsAndOptions = Partial<View3DProps & View3DOptions>;

const view3DSetterNames = Object.getOwnPropertyNames(VanillaView3D.prototype)
  .filter(name => {
    const descriptor = Object.getOwnPropertyDescriptor(VanillaView3D.prototype, name);

    if (name.startsWith("_")) return false;
    if (descriptor?.value) return false;

    return !!descriptor!.set;
  });

class View3D extends React.PureComponent<View3DPropsAndOptions> {
  public static defaultProps: Partial<View3DProps> = {
    tag: "div"
  };

  private _vanillaView3D: VanillaView3D;
  private _containerEl: HTMLElement;

  public get view3D() { return this._vanillaView3D; }
  public get element() { return this._containerEl; }

  public constructor(props: View3DPropsAndOptions) {
    super(props);

    withMethods(this, "_vanillaView3D");
  }

  public componentDidMount() {
    this._vanillaView3D = new VanillaView3D(
      this._containerEl,
      this.props
    );

    this._bindEvents();
  }

  public componentWillUnmount() {
    this._vanillaView3D.destroy();
  }

  public componentDidUpdate(prevProps) {
    const view3D = this._vanillaView3D;

    view3DSetterNames.forEach(name => {
      const oldProp = prevProps[name];
      const newProp = this.props[name];

      if (newProp !== oldProp) {
        view3D[name] = newProp;
      }
    });
  }

  public render() {
    const {
      tag,
      className = "",
      canvasClass = "",
      ...restProps
    } = this.props;
    const Container = tag as any;

    const wrapperClassName = `${DEFAULT_CLASS.WRAPPER} ${className}`.trim();
    const canvasClassName = `${DEFAULT_CLASS.CANVAS} ${canvasClass}`.trim();

    const attributes: { [key: string]: any } = {};

    for (const name in restProps) {
      if (!(name.startsWith("on")) && !(name in VanillaView3D.prototype)) {
        attributes[name] = restProps[name];
      }
    }

    return <Container {...attributes} className={wrapperClassName} ref={(e?: HTMLElement) => {
      e && (this._containerEl = e);
    }}>
      <canvas className={canvasClassName} />
      { this.props.children }
    </Container>;
  }

  private _bindEvents() {
    const view3D = this._vanillaView3D;

    Object.keys(EVENTS).forEach((eventKey: keyof typeof EVENTS) => {
      const eventName = EVENTS[eventKey];
      const propName = `on${eventName.charAt(0).toUpperCase() + eventName.slice(1)}`;

      view3D.on(eventName, e => {
        e.target = this;

        const evtHandler = this.props[propName];
        if (evtHandler) {
          evtHandler(e);
        }
      });
    });
  }
}

interface View3D extends React.Component<View3DPropsAndOptions>, VanillaView3D {}
export default View3D;
