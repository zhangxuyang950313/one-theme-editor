import { createSelector } from "reselect";
import { TypeStoreState } from "@/store/index";

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
export const getProjectPageConfData = createSelector(
  getState,
  state => state.pageConfData
);
