import { createContext, useReducer, useContext } from "react";

type TypeActionSetCurrentKey = {
  type: ActionTypes.SET_CURRENT_KEY;
  payload: string;
};
type TypeState = typeof initialState;
type TypeActionTypes = TypeActionSetCurrentKey;

enum ActionTypes {
  SET_CURRENT_KEY
}

const initialState = {
  currentKey: "",
  setKey: (val: string) => {
    //
  }
};

export function ActionSetCurrentKey(payload: string): TypeActionSetCurrentKey {
  return {
    type: ActionTypes.SET_CURRENT_KEY,
    payload
  };
}

function reducer(state: TypeState, action: TypeActionTypes) {
  switch (action.type) {
    case ActionTypes.SET_CURRENT_KEY: {
      return { ...state, currentKey: action.payload };
    }
    default: {
      return state;
    }
  }
}

const Context = createContext(initialState);

export function useCurrentKey(): [string, (key: string) => void] {
  const context = useContext(Context);
  const [state, setState] = useReducer(reducer, context);
  return [state.currentKey, (key: string) => setState(ActionSetCurrentKey(key))];
}

export default Context;
