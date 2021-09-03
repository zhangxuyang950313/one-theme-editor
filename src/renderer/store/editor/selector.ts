import path from "path";
import { createSelector } from "reselect";
import { GlobalStore } from "@/store/index";
import { ELEMENT_TAG, PROJECT_FILE_TYPE } from "src/enum";
import { TypeEditorState } from "./reducer";
// 数据
const stateSelector = (state: TypeEditorState) => state;

// 获取工程数据
export const selectProjectData = createSelector(
  stateSelector,
  state => state.projectData
);

// 获取厂商信息
export const selectProjectBrandInfo = createSelector(
  selectProjectData,
  state => state.brandOption
);

export const selectProjectInfo = createSelector(
  selectProjectData,
  state => state.projectInfo
);

// 获取工程 uuid
export const selectProjectUUID = createSelector(
  stateSelector,
  state => state.uuid
);

// 获取工程本地路径
export const selectProjectRoot = createSelector(
  selectProjectData,
  state => state.projectRoot
);

// 获取当前资源配置信息
export const selectSourceConfig = createSelector(
  stateSelector,
  state => state.sourceConfig
);

export const selectSourceConfigUrl = createSelector(
  stateSelector,
  state => state.sourceConfigUrl
);

// 获取当前 sourceConfig namespace
export const selectSourceConfigNS = createSelector(
  selectSourceConfigUrl,
  sourceConfigUrl => {
    return sourceConfigUrl ? path.dirname(sourceConfigUrl) : "";
  }
);

// 获取当前资源配置根目录
export const selectSourceConfigRoot = createSelector(
  selectSourceConfigNS,
  namespace => {
    const dir = GlobalStore.store.getState().base.appPath?.SOURCE_CONFIG_DIR;
    if (!dir || !namespace) return "";
    return path.join(dir, namespace);
  }
);

// 获取模块列表
export const selectSourceModuleList = createSelector(
  stateSelector,
  state => state.sourceModuleList
);

// 获取当前模块
export const selectSourceModuleConf = createSelector(
  stateSelector,
  state => state.sourceModuleSelected
);

// 获取页面组列表
export const selectSourcePageGroupList = createSelector(
  stateSelector,
  state => state.sourceModuleSelected.groupList || []
);

// 获取当前页面
export const selectSourcePageConf = createSelector(
  stateSelector,
  state => state.sourcePageSelected
);

export const selectSourceTypeList = createSelector(
  stateSelector,
  state => state.sourceTypeList
);

export const selectSourcePageDataMap = createSelector(
  stateSelector,
  state => state.sourcePageDataMap
);
// 获取当前页面 sourcePageData
export const selectSourcePageData = createSelector(stateSelector, state => {
  const pageConfSrc = state.sourcePageSelected.src;
  return state.sourcePageDataMap[pageConfSrc] || null;
});

// 获取所有元素列表
export const selectLayoutSourceList = createSelector(stateSelector, state => {
  const pageConfSrc = state.sourcePageSelected.src;
  if (!pageConfSrc) return [];
  return state.sourcePageDataMap[pageConfSrc]?.layoutElementList || [];
});

// 获取图片元素列表
export const selectLayoutImageList = createSelector(
  selectLayoutSourceList,
  elementList =>
    elementList.flatMap(item =>
      item.sourceTag === ELEMENT_TAG.Image ? [item] : []
    )
);

// 获取文字元素列表
export const selectLayoutTextList = createSelector(
  selectLayoutSourceList,
  elementList =>
    elementList.flatMap(item =>
      item.sourceTag === ELEMENT_TAG.Text ? [item] : []
    )
);

// 获取资源定义列表
export const selectSourceDefineList = createSelector(
  selectSourcePageData,
  pageData => pageData?.sourceDefineList || []
);

// 获取资源图片列表
export const selectSourceImageDefineList = createSelector(
  selectSourceDefineList,
  sourceDefineList => {
    return sourceDefineList.flatMap(item => {
      if (item.tagName === ELEMENT_TAG.Image) return [item];
      return [];
    });
  }
);

// 获取值资源列表
export const selectSourceValueDefineList = createSelector(
  selectSourceDefineList,
  sourceDefineList => {
    return sourceDefineList.flatMap(item => {
      if (item.tagName !== ELEMENT_TAG.Image) return [item];
      return [];
    });
  }
);

export const selectProjectFileDataMap = createSelector(
  stateSelector,
  state => state.projectFileDataMap
);

export const selectProjectImageFileDataMap = createSelector(
  selectProjectFileDataMap,
  projectFileDataMap => {
    const entries = Object.entries(projectFileDataMap).flatMap(([key, val]) => {
      return val.type === PROJECT_FILE_TYPE.IMAGE
        ? [[key, val] as [string, typeof val]]
        : [];
    });
    return new Map(entries);
  }
);

export const selectProjectXmlFileDataMap = createSelector(
  selectProjectFileDataMap,
  projectFileDataMap => {
    const entries = Object.entries(projectFileDataMap).flatMap(([key, val]) => {
      return val.type === PROJECT_FILE_TYPE.XML
        ? [[key, val] as [string, typeof val]]
        : [];
    });
    return new Map(entries);
  }
);
