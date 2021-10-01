import {
  TypeProjectDataDoc,
  TypeProjectInfo,
  TypeProjectFileData
} from "src/types/project";
import {
  TypeResourceConfig,
  TypeResourceModuleConf,
  TypeResourcePageOption,
  TypeResourcePageConf
} from "src/types/resource";

export enum ACTION_TYPES {
  // 初始化
  INIT_EDITOR = "INIT_EDITOR",
  // 设置资源配置
  SET_RESOURCE_CONFIG = "SET_RESOURCE_CONFIG",
  // 设置模块配置
  SET_MODULE_CONFIG = "SET_MODULE_CONFIG",
  // 设置页面配置
  SET_PAGE_CONFIG = "SET_PAGE_CONFIG",
  // 添加页面配置数据映射
  PATCH_PAGE_CONFIG = "PATCH_PAGE_CONFIG",
  // 添加工程文件数据映射
  PATCH_PROJECT_RESOURCE = "PATCH_PROJECT_RESOURCE",

  // 设置工程新数据
  SET_PROJECT_DATA = "SET_PROJECT_DATA",
  // 设置工程描述数据
  SET_PROJECT_INFO = "SET_PROJECT_INFO"
}

type TypeActionInitEditor = {
  type: typeof ACTION_TYPES.INIT_EDITOR;
};

type TypeActionSetSourceConfig = {
  type: typeof ACTION_TYPES.SET_RESOURCE_CONFIG;
  payload: TypeResourceConfig;
};

// 设置模块
type TypeActionSetModuleConf = {
  type: typeof ACTION_TYPES.SET_MODULE_CONFIG;
  payload: TypeResourceModuleConf;
};

// 更新页面配置表
type TypeActionPatchPageConfMap = {
  type: typeof ACTION_TYPES.PATCH_PAGE_CONFIG;
  payload: TypeResourcePageConf;
};

// 设置页面
type TypeActionSetPageConf = {
  type: typeof ACTION_TYPES.SET_PAGE_CONFIG;
  payload: TypeResourcePageOption;
};

// 设置工程数据
type TypeActionSetProjectData = {
  type: typeof ACTION_TYPES.SET_PROJECT_DATA;
  payload: TypeProjectDataDoc;
};

// 设置工程描述信息
type TypeActionSetProjectInfo = {
  type: typeof ACTION_TYPES.SET_PROJECT_INFO;
  payload: TypeProjectInfo;
};

// 更新工程文件数据表
type TypeActionPatchProjectSourceDataMap = {
  type: typeof ACTION_TYPES.PATCH_PROJECT_RESOURCE;
  payload: TypeProjectFileData;
};

// main actions
export type TypeEditorActions =
  | TypeActionInitEditor
  | TypeActionSetSourceConfig
  | TypeActionSetModuleConf
  | TypeActionPatchPageConfMap
  | TypeActionSetPageConf
  | TypeActionSetProjectData
  | TypeActionSetProjectInfo
  | TypeActionPatchProjectSourceDataMap;

export function ActionInitEditor(): TypeActionInitEditor {
  return { type: ACTION_TYPES.INIT_EDITOR };
}

// 设置当前资源配置
export function ActionSetSourceConfig(
  payload: TypeResourceConfig
): TypeActionSetSourceConfig {
  return { type: ACTION_TYPES.SET_RESOURCE_CONFIG, payload };
}

// 设置当前模块配置
export function ActionSetCurrentModule(
  payload: TypeResourceModuleConf
): TypeActionSetModuleConf {
  return { type: ACTION_TYPES.SET_MODULE_CONFIG, payload };
}

// 更新页面数据表
export function ActionPatchPageDataMap(
  payload: TypeResourcePageConf
): TypeActionPatchPageConfMap {
  return { type: ACTION_TYPES.PATCH_PAGE_CONFIG, payload };
}

// 设置当前页面配置
export function ActionSetCurrentPage(
  payload: TypeResourcePageOption
): TypeActionSetPageConf {
  return { type: ACTION_TYPES.SET_PAGE_CONFIG, payload };
}

// 设置工程数据
export function ActionSetProjectData(
  payload: TypeProjectDataDoc
): TypeActionSetProjectData {
  return { type: ACTION_TYPES.SET_PROJECT_DATA, payload };
}

// 设置 description
export function ActionSetDescription(
  payload: TypeProjectInfo
): TypeActionSetProjectInfo {
  return { type: ACTION_TYPES.SET_PROJECT_INFO, payload };
}

export function ActionPatchProjectSourceData(
  payload: TypeProjectFileData
): TypeActionPatchProjectSourceDataMap {
  return { type: ACTION_TYPES.PATCH_PROJECT_RESOURCE, payload };
}
