import { TypeProjectDataDoc, TypeProjectInfo } from "types/project";
import {
  TypeSourceConfigData,
  TypeSourceModuleConf,
  TypeSourcePageConf,
  TypeSourcePageData
} from "types/source-config";

export enum ACTION_TYPES {
  // 设置资源配置
  SET_SOURCE_CONFIG = "SET_SOURCE_CONFIG",
  // 设置模块配置
  SET_MODULE_CONFIG = "SET_MODULE_CONFIG",
  // 设置页面配置
  SET_PAGE_CONFIG = "SET_PAGE_CONFIG",
  // 设置页面配置数据
  UPDATE_PAGE_DATA = "UPDATE_PAGE_DATA",

  // 设置工程新数据
  SET_PROJECT_DATA = "SET_PROJECT_DATA",
  // 设置工程描述数据
  SET_PROJECT_INFO = "SET_PROJECT_INFO"
}

type TypeActionSetSourceConfig = {
  type: typeof ACTION_TYPES.SET_SOURCE_CONFIG;
  payload: TypeSourceConfigData;
};

// 设置模块
type TypeActionSetModuleConf = {
  type: typeof ACTION_TYPES.SET_MODULE_CONFIG;
  payload: TypeSourceModuleConf;
};

// 更新页面配置表
type TypeActionUpdatePageDataMap = {
  type: typeof ACTION_TYPES.UPDATE_PAGE_DATA;
  payload: TypeSourcePageData;
};

// 设置页面
type TypeActionSetPageConf = {
  type: typeof ACTION_TYPES.SET_PAGE_CONFIG;
  payload: TypeSourcePageConf;
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

// main actions
export type TypeEditorActions =
  | TypeActionSetSourceConfig
  | TypeActionSetModuleConf
  | TypeActionUpdatePageDataMap
  | TypeActionSetPageConf
  | TypeActionSetProjectData
  | TypeActionSetProjectInfo;

// 设置当前资源配置
export function ActionSetSourceConfig(
  payload: TypeSourceConfigData
): TypeActionSetSourceConfig {
  return { type: ACTION_TYPES.SET_SOURCE_CONFIG, payload };
}

// 设置当前模块配置
export function ActionSetCurrentModule(
  payload: TypeSourceModuleConf
): TypeActionSetModuleConf {
  return { type: ACTION_TYPES.SET_MODULE_CONFIG, payload };
}

// 更新页面数据表
export function ActionUpdatePageDataMap(
  payload: TypeSourcePageData
): TypeActionUpdatePageDataMap {
  return { type: ACTION_TYPES.UPDATE_PAGE_DATA, payload };
}

// 设置当前页面配置
export function ActionSetCurrentPage(
  payload: TypeSourcePageConf
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
