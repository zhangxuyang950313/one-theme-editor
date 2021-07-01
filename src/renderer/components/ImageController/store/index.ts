// 局部 reducer 暂时用不着，代码放着后面可能用

import { composeWithDevTools } from "redux-devtools-extension";
import { createStore } from "redux";
import React from "react";
import { createDispatchHook, createStoreHook } from "react-redux";

const storeState = { a: 1 };
function reducer(state = storeState, action: { type: "a"; payload: number }) {
  return { ...state, a: action.payload };
}
const composeEnhancers = composeWithDevTools({ name: "ImageController" });
const store = createStore(reducer, composeEnhancers());
const Context = React.createContext({ store, storeState });

export const dispatchHook = createDispatchHook(Context);

export const storeHook = createStoreHook(Context);

/**
 * how to use
 * ```
  const dispatch = dispatchHook();
  const store = storeHook();

  useEffect(() => {
    dispatch({ type: "a", payload: 3 });
    setTimeout(() => {
      console.log(store.getState());
    }, 2000);
  }, []);
 * ```
 */
