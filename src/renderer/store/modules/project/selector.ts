import { createSelector } from "reselect";
import { TypeStoreState } from "@/store/index";

// 数据
const getProjectState = (state: TypeStoreState) => state.project;

// 获取厂商信息
export const getProjectBrandInfo = createSelector(
  getProjectState,
  state => state.brandInfo
);

// 获取工程数据
export const getProjectData = createSelector(
  getProjectState,
  state => state.projectData
);

export const getProjectImageList = createSelector(
  getProjectState,
  state => state.imageList
);

export const findProjectImage = createSelector(
  getProjectState,
  state => (target: string) =>
    state.imageList.find(item => item.target === target)
);

// // 获取工程ui版本信息
// export const getProjectUiVersion = createSelector(
//   getState,
//   state => state.uiVersion
// );

// // 获取工程描述信息
// export const getProjectDescInfo = createSelector(
//   getState,
//   state => state.projectInfo
// );

// // 获取工程模板
// export const getProjectTemplateConf = createSelector(
//   getState,
//   state => state.templateConf
// );

// // 获取工程预览配置
// export const getProjectPreviewConf = createSelector(
//   getState,
//   state => state.previewConf
// );

// // 获取工程预览所需数据
// export const getProjectPageConfData = createSelector(
//   getState,
//   state => state.pageConfData
// );
