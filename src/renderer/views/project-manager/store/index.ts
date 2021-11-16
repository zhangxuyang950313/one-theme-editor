/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useContext } from "react";

import Reducer from "./reducer";

import { createStoreFactory } from "@/store/utils";

// 工程管理页面
const NAME = "ProjectManager";
export const ProjectManagerStore = createStoreFactory(NAME, Reducer);
export const ProjectManagerState = ProjectManagerStore.store.getState();
export const useProjectManagerStore = ProjectManagerStore.storeHook;
export const useProjectManagerDispatch = ProjectManagerStore.dispatchHook;
export const useProjectManagerSelector = ProjectManagerStore.selectorHook;
export const useProjectManagerContext = () =>
  useContext(ProjectManagerStore.context);
export type TypeProjectManagerState = typeof ProjectManagerState;
