/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useContext } from "react";

import EditorReducers from "./reducer";

import { createStoreFactory } from "@/store/utils";

// 编辑器
export const EditorStore = createStoreFactory("ProjectEditor", EditorReducers);
export const EditorState = EditorStore.store.getState();
export const useEditorStore = EditorStore.storeHook;
export const useEditorDispatch = EditorStore.dispatchHook;
export const useEditorSelector = EditorStore.selectorHook;
export const useEditorContext = () => useContext(EditorStore.context);
export type TypeEditorState = typeof EditorState;
