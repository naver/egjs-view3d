/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

/**
 * Interface for AR sessions
 * @interface
 * @property {function} enter Enter this session.
 * @property {function} exit Exit this session.
 */
interface ARSession {
  enter: () => Promise<any>;
  exit: () => Promise<any>;
}

export default ARSession;
