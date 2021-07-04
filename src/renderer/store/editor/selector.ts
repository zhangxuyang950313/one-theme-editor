import path from "path";
import { createSelector } from "reselect";
import { GlobalStore } from "@/store/index";
import { TypeEditorState } from "./reducer";

// 数据
const getState = (state: TypeEditorState) => state;

// 获取当前资源配置信息
export const getSourceConfig = createSelector(
  getState,
  state => state.currentConfig
);

// 获取当前资源配置根目录
export const getSourceConfigRoot = createSelector(getState, state => {
  const dir = GlobalStore.store.getState().base.pathConfig?.SOURCE_CONFIG_DIR;
  const ns = state.currentConfig?.namespace;
  if (!dir || !ns) return "";
  return path.join(dir, ns);
});

// 获取模块列表
export const getSCModuleList = createSelector(
  getSourceConfig,
  state => state?.moduleList || []
);

// 获取当前模块
export const getCurrentModule = createSelector(
  getState,
  state => state.currentModule
);

// 获取页面组列表
export const getCurrentPageGroupList = createSelector(
  getCurrentModule,
  state => state?.groupList || []
);

// 获取当前页面
export const getCurrentPage = createSelector(
  getState,
  state => state.currentPage
);

export const getCurrentSourceList = createSelector(
  getState,
  state => state.currentPage?.elementList || []
);

export const getCurrentSourceTypeList = createSelector(
  getState,
  state => state.currentConfig?.sourceTypeList || []
);

export const getCurrentXmlTemplateList = createSelector(
  getState,
  state => state.currentPage?.templateList || []
);

export const getProjectState = createSelector(
  getState,
  state => state.projectData || null
);

// 获取厂商信息
export const getProjectBrandInfo = createSelector(
  getProjectState,
  state => state?.brandInfo || null
);

// 获取工程数据
export const getProjectData = createSelector(getProjectState, state => state);

// 获取工程 uuid
export const getProjectUUID = createSelector(
  getProjectState,
  state => state?.uuid || null
);

// 获取工程本地路径
export const getProjectRoot = createSelector(
  getProjectState,
  state => state?.projectRoot || null
);
