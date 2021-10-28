/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useContext } from "react";
import { createStoreFactory } from "../utils";

import StarterReducers from "./reducer";

// 开始页面
export const StarterStore = createStoreFactory("Starter", StarterReducers);
export const StarterState = StarterStore.store.getState();
export const useStarterStore = StarterStore.storeHook;
export const useStarterDispatch = StarterStore.dispatchHook;
export const useStarterSelector = StarterStore.selectorHook;
export const useStarterContext = () => useContext(StarterStore.context);
export type TypeStarterState = typeof StarterState;
