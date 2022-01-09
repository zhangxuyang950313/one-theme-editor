import React from "react";
import { Action, createStore, Reducer } from "redux";
import { createDispatchHook, createSelectorHook, createStoreHook } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";

// selector 返回 [state, setState] 结构的定义
export type TypeSelectorResult<T, R = void> = [T, (data: T) => R];

// 更新 state
export function updateState<T>(oldState: T, newState: Partial<T>): T {
  // undefined 是不被允许的赋值操作，空传 null
  // undefined 是不被允许的赋值操作，空传 null
  // undefined 是不被允许的赋值操作，空传 null
  for (const key in newState) {
    if (newState[key] === undefined) {
      delete newState[key];
    }
    const typeOld = Object.prototype.toString.call(oldState[key]);
    const typeNew = Object.prototype.toString.call(newState[key]);
    // 赋值类型不同警告，但不会拦截
    if (oldState[key] !== null && typeNew !== typeOld) {
      console.warn(
        `[store] ${key} 类型不符
         [old]: ${typeOld}
         [new]: ${typeNew}`
      );
    }
  }
  return Object.assign({}, oldState, newState);
}
// 创建 redux store
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function createStoreFactory<S, A extends Action>(name: string, reducer: Reducer<S, A>) {
  const enhancer = composeWithDevTools({ name });
  const store = createStore(reducer, enhancer());
  const storeState = store.getState();
  const context = React.createContext({ store, storeState });
  const storeHook = createStoreHook(context);
  const dispatchHook = createDispatchHook(context);
  const selectorHook = createSelectorHook(context);
  return { store, context, storeHook, dispatchHook, selectorHook };
}
