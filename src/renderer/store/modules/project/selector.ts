import { createSelector } from "reselect";
import { TypeStoreState } from "@/store/index";
import { TypeImageData } from "@/types/project";

// 数据
const getState = (state: TypeStoreState) => state.projectState;

// 获取厂商信息
export const getProjectBrandInfo = createSelector(
  getState,
  state => state.brandInfo
);

// 获取项目ui版本信息
export const getProjectUiVersion = createSelector(
  getState,
  state => state.uiVersion
);

// 获取项目描述信息
export const getProjectDescInfo = createSelector(
  getState,
  state => state.projectInfo
);

// 获取项目模板
export const getProjectTemplateConf = createSelector(
  getState,
  state => state.templateConf
);

// 获取项目预览配置
export const getProjectPreviewConf = createSelector(
  getState,
  state => state.previewConf
);

// 获取项目预览所需数据
export const getProjectPreviewData = createSelector(
  getState,
  state => state.previewData
);

// 获取图片信息
export const getImageDataByKey = createSelector(
  getState,
  state => (key: string) => {
    return state.previewData?.imageData.find(o => o.key === key) || null;
  }
);

// 获取页面配置信息
export const getPageConfByKey = createSelector(
  getState,
  state => (key: string) => {
    return state.previewData?.pageConfData.find(o => o.key === key) || null;
  }
);
