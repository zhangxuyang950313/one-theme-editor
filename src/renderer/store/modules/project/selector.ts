import { createSelector } from "reselect";
import { TypeStoreState } from "@/store/index";

// 数据
const getProjectState = (state: TypeStoreState) => state.project;

// 获取厂商信息
export const getProjectBrandInfo = createSelector(
  getProjectState,
  state => state.brand
);

// 获取工程数据
export const getProjectData = createSelector(getProjectState, state => state);

// 获取工程 uuid
export const getProjectUUID = createSelector(
  getProjectState,
  state => state.uuid
);

// 获取工程本地路径
export const getProjectLocalPath = createSelector(
  getProjectState,
  state => state.localPath || null
);

export const getProjectImageList = createSelector(
  getProjectState,
  state => state.imageMapperList || []
);

export const findProjectImage = createSelector(
  getProjectState,
  state => (target: string) =>
    (state.imageMapperList || []).find(item => item.target === target)
);

// 当前素材总大小
export const currentImageSize = createSelector(getProjectState, state =>
  (state.imageMapperList || []).reduce((t, o) => (t += o.size), 0)
);

// // 获取工程ui版本信息
// export const getProjectUiVersion = createSelector(
//   getState,
//   state => state.uiVersion
// );

// // 获取工程描述信息
// export const getProjectDescInfo = createSelector(
//   getState,
//   state => state.description
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
