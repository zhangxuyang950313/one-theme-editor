import path from "path";
import { createSelector } from "reselect";
import { GlobalStore } from "@/store/index";
import { ELEMENT_TAG } from "src/enum";
import { TypeEditorState } from "./reducer";
// 数据
const getState = (state: TypeEditorState) => state;

// 获取工程数据
export const getProjectData = createSelector(
  getState,
  state => state.projectData
);

// 获取厂商信息
export const getProjectBrandInfo = createSelector(
  getProjectData,
  state => state.brandInfo
);

export const getProjectInfo = createSelector(
  getProjectData,
  state => state.projectInfo
);

// 获取工程 uuid
export const getProjectUUID = createSelector(getState, state => state.uuid);

// 获取工程本地路径
export const getProjectRoot = createSelector(
  getProjectData,
  state => state.projectRoot
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
  state => state.sourceModuleConf.groupList || []
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

export const getSourcePageDataMap = createSelector(
  getState,
  state => state.sourcePageDataMap
);
// 获取当前页面 sourcePageData
export const getSourcePageData = createSelector(getState, state => {
  const pageConfSrc = state.sourcePageConf.src;
  return state.sourcePageDataMap[pageConfSrc] || null;
});

// 获取所有元素列表
export const getLayoutSourceList = createSelector(getState, state => {
  const pageConfSrc = state.sourcePageConf.src;
  if (!pageConfSrc) return [];
  return state.sourcePageDataMap[pageConfSrc]?.layoutElementList || [];
});

// 获取图片元素列表
export const getLayoutImageList = createSelector(
  getLayoutSourceList,
  elementList =>
    elementList.flatMap(item =>
      item.sourceTag === ELEMENT_TAG.IMAGE ? [item] : []
    )
);

// 获取文字元素列表
export const getLayoutTextList = createSelector(
  getLayoutSourceList,
  elementList =>
    elementList.flatMap(item =>
      item.sourceTag === ELEMENT_TAG.TEXT ? [item] : []
    )
);

// 获取资源定义列表
export const getSourceDefineList = createSelector(
  getSourcePageData,
  pageData => pageData?.sourceDefineList || []
);

// 获取资源图片列表
export const getSourceImageDefineList = createSelector(
  getSourceDefineList,
  sourceDefineList => {
    return sourceDefineList.flatMap(item => {
      if (item.tagName === ELEMENT_TAG.IMAGE) return [item];
      return [];
    });
  }
);

// 获取值资源列表
export const getSourceValueDefineList = createSelector(
  getSourceDefineList,
  sourceDefineList => {
    return sourceDefineList.flatMap(item => {
      if (item.tagName !== ELEMENT_TAG.IMAGE) return [item];
      return [];
    });
  }
);

export const getProjectFileDataMap = createSelector(
  getState,
  state => state.projectFileDataMap
);
