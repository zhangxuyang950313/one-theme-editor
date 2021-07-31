/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useContext } from "react";
import { createStoreFactory } from "./utils";

import GlobalReducers from "./global/reducers";
import StarterReducers from "./starter/reducer";
import EditorReducers from "./editor/reducer";

// 全局
export const GlobalStore = createStoreFactory("Global", GlobalReducers);
export const GlobalState = GlobalStore.store.getState();
export const useGlobalStore = GlobalStore.storeHook;
export const useGlobalDispatch = GlobalStore.dispatchHook;
export const useGlobalSelector = GlobalStore.selectorHook;
export const useGlobalContext = () => useContext(GlobalStore.context);
export type TypeGlobalState = typeof GlobalState;

// 开始页面
export const StarterStore = createStoreFactory("Starter", StarterReducers);
export const StarterState = StarterStore.store.getState();
export const useStarterStore = StarterStore.storeHook;
export const useStarterDispatch = StarterStore.dispatchHook;
export const useStarterSelector = StarterStore.selectorHook;
export const useStarterContext = () => useContext(StarterStore.context);
export type TypeStarterState = typeof StarterState;

// 编辑器
export const EditorStore = createStoreFactory("Editor", EditorReducers);
export const EditorState = EditorStore.store.getState();
export const useEditorStore = EditorStore.storeHook;
export const useEditorDispatch = EditorStore.dispatchHook;
export const useEditorSelector = EditorStore.selectorHook;
export const useEditorContext = () => useContext(EditorStore.context);
export type TypeEditorState = typeof EditorState;
