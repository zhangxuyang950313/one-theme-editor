import path from "path";
import { createSelector } from "reselect";
import { GlobalStore } from "@/store/index";
import { TypeEditorState } from "./reducer";

// 数据
const getState = (state: TypeEditorState) => state;

// 获取当前资源配置信息
export const getSourceConfig = createSelector(
  getState,
  state => state.sourceConfig
);

export const getSourceConfigFile = createSelector(
  getState,
  state => state.sourceConfigFile
);

// 获取当前 sourceConfig namespace
export const getSourceConfigNamespace = createSelector(getState, state => {
  return state.sourceConfigFile ? path.dirname(state.sourceConfigFile) : "";
});

// 获取当前资源配置根目录
export const getSourceConfigRoot = createSelector(
  getSourceConfigNamespace,
  namespace => {
    const dir = GlobalStore.store.getState().base.pathConfig?.SOURCE_CONFIG_DIR;
    if (!dir || !namespace) return "";
    return path.join(dir, namespace);
  }
);

// 获取模块列表
export const getModuleList = createSelector(
  getState,
  state => state.sourceModuleList
);

// 获取当前模块
export const getCurrentModule = createSelector(
  getState,
  state => state.currentModule
);

// 获取页面组列表
export const getPageGroupList = createSelector(
  getState,
  state => state.currentPageGroupList
);

// 获取当前页面
export const getCurrentPage = createSelector(
  getState,
  state => state.currentPage
);

export const getSourceElementList = createSelector(
  getState,
  state => state.sourceElementList
);

export const getSourceTypeList = createSelector(
  getState,
  state => state.sourceTypeList
);

export const getXmlTemplateList = createSelector(getState, state => []);

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
  getState,
  state => state?.uuid || null
);

// 获取工程本地路径
export const getProjectRoot = createSelector(
  getProjectState,
  state => state?.projectRoot || null
);
