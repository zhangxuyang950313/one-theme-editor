import ACTION_TYPES from "@/store/actions";

import { TypeDatabase, TypeProjectData } from "types/project.d";

type TypeActionInitProject = {
  type: typeof ACTION_TYPES.INIT_PROJECT;
};

type TypeActionSetProject = {
  type: typeof ACTION_TYPES.SET_PROJECT;
  payload: TypeDatabase<TypeProjectData>;
};

type TypeActionUpdateProject = {
  type: typeof ACTION_TYPES.UPDATE_PROJECT;
};

// type TypeSetProjectBrandInfo = {
//   type: typeof ACTION_TYPES.SET_PROJECT_BRAND_INFO;
//   brandInfo: TypeBrandConf;
// };

// type TypeSetProjectUiVersion = {
//   type: typeof ACTION_TYPES.SET_PROJECT_UI_VERSION;
//   uiVersion: TypeUiVersionConf;
// };

// type TypeSetProjectDescInfo = {
//   type: typeof ACTION_TYPES.SET_PROJECT_DESC_INFO;
//   info: TypeProjectDesc;
// };

// type TypeSetProjectTempConf = {
//   type: typeof ACTION_TYPES.SET_PROJECT_TEMP_CONF;
//   tempConf: TypeTemplateInfo;
// };

// type TypeSetProjectPreviewConf = {
//   type: typeof ACTION_TYPES.SET_PROJECT_PREVIEW_CONF;
//   previewConf: TypeTemplateConf;
// };

// type TypeSetProjectPageConfData = {
//   type: typeof ACTION_TYPES.SET_PROJECT_PAGE_CONF_DATA;
//   pageConfData: TypePageConf[];
// };

export type TypeActions =
  | TypeActionInitProject
  | TypeActionSetProject
  | TypeActionUpdateProject;

// 初始化工程信息
export function initProject(): TypeActionInitProject {
  return { type: ACTION_TYPES.INIT_PROJECT };
}

// 设置工程数据
export function setProject(
  projectData: TypeDatabase<TypeProjectData>
): TypeActionSetProject {
  return { type: ACTION_TYPES.SET_PROJECT, payload: projectData };
}

// 自动更新工程数据到数据库
export function updateProject(): TypeActionUpdateProject {
  return { type: ACTION_TYPES.UPDATE_PROJECT };
}

// // 设置工程厂商信息
// export function setProjectBrandInfo(
//   brandInfo: TypeBrandConf
// ): TypeSetProjectBrandInfo {
//   return { type: ACTION_TYPES.SET_PROJECT_BRAND_INFO, brandInfo };
// }

// // 设置 ui 版本信息
// export function setProjectUiVersion(
//   uiVersion: TypeUiVersionConf
// ): TypeSetProjectUiVersion {
//   return { type: ACTION_TYPES.SET_PROJECT_UI_VERSION, uiVersion };
// }

// // 设置项目描述信息
// export function setProjectDescInfo(
//   info: TypeProjectDesc
// ): TypeSetProjectDescInfo {
//   return { type: ACTION_TYPES.SET_PROJECT_DESC_INFO, info };
// }

// // 设置模板原始数据
// export function setProjectTempConf(
//   tempConf: TypeTemplateInfo
// ): TypeSetProjectTempConf {
//   return { type: ACTION_TYPES.SET_PROJECT_TEMP_CONF, tempConf };
// }

// // 设置用于预览的配置数据
// export function setProjectPreviewConf(
//   previewConf: TypeTemplateConf
// ): TypeSetProjectPreviewConf {
//   return { type: ACTION_TYPES.SET_PROJECT_PREVIEW_CONF, previewConf };
// }

// // 设置页面配置数据
// export function setProjectPageConfData(
//   pageConfData: TypePageConf[]
// ): TypeSetProjectPageConfData {
//   return { type: ACTION_TYPES.SET_PROJECT_PAGE_CONF_DATA, pageConfData };
// }
