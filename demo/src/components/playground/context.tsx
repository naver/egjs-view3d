import React from "react";
import VanillaView3D, { Model } from "../../../../packages/view3d/src";

export type PlaygroundAction = {
  type: "set_view3d";
  val: VanillaView3D;
} | {
  type: "set_orig_model";
  val: Model;
} | {
  type: "set_loading";
  val: boolean;
} | {
  type: "set_initialized";
  val: boolean;
};

export interface PlaygroundState {
  view3D: VanillaView3D | null;
  originalModel: Model | null;
  isLoading: boolean;
  initialized: boolean;
}

export const reducer = (state: typeof initialState, action: PlaygroundAction): PlaygroundState => {
  switch (action.type) {
    case "set_view3d":
      return {
        ...state,
        view3D: action.val
      };
    case "set_orig_model":
      return {
        ...state,
        originalModel: action.val
      };
    case "set_loading":
      return {
        ...state,
        isLoading: action.val
      };
    case "set_initialized":
      return {
        ...state,
        initialized: action.val
      };
    default:
      return state;
  }
};

export const initialState: PlaygroundState = {
  isLoading: true,
  view3D: null,
  originalModel: null,
  initialized: false
};

export const Context = React.createContext({
  state: initialState,
  dispatch: (action: PlaygroundAction) => null
});

export default ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <Context.Provider value={{
      state,
      dispatch: dispatch as any
    }}>
    	{ children }
    </Context.Provider>
  );
};
