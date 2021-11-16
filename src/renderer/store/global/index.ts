/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useContext } from "react";

import { createStoreFactory } from "../utils";

import GlobalReducers from "./reducers";

// 全局
export const GlobalStore = createStoreFactory("Global", GlobalReducers);
export const GlobalState = GlobalStore.store.getState();
export const useGlobalStore = GlobalStore.storeHook;
export const useGlobalDispatch = GlobalStore.dispatchHook;
export const useGlobalSelector = GlobalStore.selectorHook;
export const useGlobalContext = () => useContext(GlobalStore.context);
export type TypeGlobalState = typeof GlobalState;
