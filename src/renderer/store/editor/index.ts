/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useContext } from "react";
import { createStoreFactory } from "../utils";

import EditorReducers from "./reducer";

// 编辑器
export const EditorStore = createStoreFactory("Editor", EditorReducers);
export const EditorState = EditorStore.store.getState();
export const useEditorStore = EditorStore.storeHook;
export const useEditorDispatch = EditorStore.dispatchHook;
export const useEditorSelector = EditorStore.selectorHook;
export const useEditorContext = () => useContext(EditorStore.context);
export type TypeEditorState = typeof EditorState;
