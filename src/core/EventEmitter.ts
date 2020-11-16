/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import { AnyFunction } from "~/types/external";

type NoArguments = undefined | null | void | never;
type EventMap = Record<string, any>;
type EventKey<T extends EventMap> = string & keyof T;
type EventCallback<T extends EventMap, K extends EventKey<T>>
  = T[K] extends NoArguments
    ? () => any
    : T[K] extends AnyFunction
      ? T[K]
      : (event: T[K]) => any;

class EventEmitter<T extends EventMap> {
  private _listenerMap: Map<EventKey<T>, Array<EventCallback<T, EventKey<T>>>>;

  constructor() {
    this._listenerMap = new Map();
  }

  public on<K extends EventKey<T>>(eventName: K, callback: EventCallback<T, K>): this {
    const listenerMap = this._listenerMap;
    const listeners = listenerMap.get(eventName);

    if (listeners && listeners.indexOf(callback) < 0) {
      listeners.push(callback);
    } else {
      listenerMap.set(eventName, [callback]);
    }
    return this;
  }

  public off<K extends EventKey<T>>(eventName: K, callback?: EventCallback<T, K>): this {
    const listenerMap = this._listenerMap;
    const listeners = listenerMap.get(eventName);

    if (!callback) {
      listenerMap.delete(eventName);
    } else if (listeners) {
      const callbackIdx = listeners.indexOf(callback);
      if (callbackIdx >= 0) {
        listeners.splice(callbackIdx, 1);
      }
    }

    return this;
  }

  public emit<K extends EventKey<T>>(eventName: K, ...event: T[K] extends NoArguments ? void[] : T[K] extends AnyFunction ? Parameters<T[K]> : [T[K]]): this {
    const listeners = this._listenerMap.get(eventName);

    if (listeners) {
      listeners.forEach(callback => {
        callback(...event);
      });
    }

    return this;
  }
}

export default EventEmitter;
