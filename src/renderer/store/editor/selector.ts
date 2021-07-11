import path from "path";
import { createSelector } from "reselect";
import { GlobalStore } from "@/store/index";
import { ELEMENT_TYPES } from "src/enum";
import { TypeEditorState } from "./reducer";

// 数据
const getState = (state: TypeEditorState) => state;

// 获取工程数据
export const getProjectData = createSelector(
  getState,
  state => state.projectData || null
);

// 获取厂商信息
export const getProjectBrandInfo = createSelector(
  getProjectData,
  state => state?.brandInfo || null
);

export const getProjectInfo = createSelector(
  getProjectData,
  state => state?.projectInfo || null
);

// 获取工程 uuid
export const getProjectUUID = createSelector(
  getState,
  state => state?.uuid || null
);

// 获取工程本地路径
export const getProjectPathname = createSelector(
  getProjectData,
  state => state?.projectPathname || null
);

// 获取当前资源配置信息
export const getSourceConfig = createSelector(
  getState,
  state => state.sourceConfig
);

export const getSourceConfigUrl = createSelector(
  getState,
  state => state.sourceConfigUrl
);

// 获取当前 sourceConfig namespace
export const getSourceConfigNamespace = createSelector(getState, state => {
  return state.sourceConfigUrl ? path.dirname(state.sourceConfigUrl) : "";
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
export const getModuleConf = createSelector(
  getState,
  state => state.sourceModuleConf
);

// 获取页面组列表
export const getPageGroupList = createSelector(
  getState,
  state => state.sourceModuleConf?.groupList || []
);

// 获取当前页面
export const getPageConf = createSelector(
  getState,
  state => state.sourcePageConf
);

export const getSourceTypeList = createSelector(
  getState,
  state => state.sourceTypeList
);

// 获取所有元素列表
export const getSourceElementList = createSelector(getState, state => {
  const pageConfSrc = state.sourcePageConf?.src;
  if (!pageConfSrc) return [];
  return state.sourcePageDataMap[pageConfSrc]?.elementList || [];
});

// 获取图片元素列表
export const getSourceImageList = createSelector(
  getSourceElementList,
  elementList =>
    elementList.flatMap(item =>
      item.elementType === ELEMENT_TYPES.IMAGE ? [item] : []
    )
);

// 获取文字元素列表
export const getSourceTextList = createSelector(
  getSourceElementList,
  elementList =>
    elementList.flatMap(item =>
      item.elementType === ELEMENT_TYPES.TEXT ? [item] : []
    )
);

export const getSourcePageDataMap = createSelector(
  getState,
  state => state.sourcePageDataMap
);

export const getXmlTemplateList = createSelector(getState, state => []);
