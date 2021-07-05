import ACTION_TYPES from "@/store/actions";
import { TypeProjectDataDoc, TypeProjectInfo } from "types/project";
import {
  TypeSourceConfig,
  TypeSourceModuleConf,
  TypeSourcePageConf,
  TypeSourcePageGroupConf
} from "types/source-config";

type TypeActionSetSourceConfig = {
  type: typeof ACTION_TYPES.SET_SOURCE_CONFIG;
  payload: TypeSourceConfig;
};

type TypeActionSetPageGroupList = {
  type: typeof ACTION_TYPES.SET_PAGE_GROUP_LIST;
  payload: TypeSourcePageGroupConf[];
};

// 设置模块
type TypeActionSetCurrentModule = {
  type: typeof ACTION_TYPES.SET_CURRENT_MODULE;
  payload: TypeSourceModuleConf;
};

// 设置页面
type TypeActionSetCurrentPage = {
  type: typeof ACTION_TYPES.SET_CURRENT_PAGE;
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
  | TypeActionSetPageGroupList
  | TypeActionSetCurrentModule
  | TypeActionSetCurrentPage
  | TypeActionSetProjectData
  | TypeActionSetProjectInfo;

// 设置当前资源配置
export function ActionSetSourceConfig(
  payload: TypeSourceConfig
): TypeActionSetSourceConfig {
  return { type: ACTION_TYPES.SET_SOURCE_CONFIG, payload };
}

// 设置当前模块配置
export function ActionSetCurrentModule(
  payload: TypeSourceModuleConf
): TypeActionSetCurrentModule {
  return { type: ACTION_TYPES.SET_CURRENT_MODULE, payload };
}

export function ActionSetPageGroupList(
  payload: TypeSourcePageGroupConf[]
): TypeActionSetPageGroupList {
  return { type: ACTION_TYPES.SET_PAGE_GROUP_LIST, payload };
}

// 设置当前页面配置
export function ActionSetCurrentPage(
  payload: TypeSourcePageConf
): TypeActionSetCurrentPage {
  return { type: ACTION_TYPES.SET_CURRENT_PAGE, payload };
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
