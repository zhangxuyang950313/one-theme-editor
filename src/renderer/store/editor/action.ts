import ACTION_TYPES from "@/store/actions";
import { TypeProjectDataDoc, TypeProjectInfo } from "types/project";
import {
  TypeSourceConfig,
  TypeSCModuleConf,
  TypeSCPageConf
} from "types/source-config";

type TypeActionSetSourceConfig = {
  type: typeof ACTION_TYPES.SET_SOURCE_CONFIG;
  payload: TypeSourceConfig;
};

// 设置模块
type TypeActionSetCurrentModule = {
  type: typeof ACTION_TYPES.SET_SOURCE_CONFIG_MODULE;
  payload: TypeSCModuleConf;
};

// 设置页面
type TypeActionSetCurrentPage = {
  type: typeof ACTION_TYPES.SET_SOURCE_CONFIG_PAGE;
  payload: TypeSCPageConf;
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
  | TypeActionSetCurrentModule
  | TypeActionSetCurrentPage
  | TypeActionSetProjectData;

// 设置当前资源配置
export function ActionSetSourceConfig(
  payload: TypeSourceConfig
): TypeActionSetSourceConfig {
  return { type: ACTION_TYPES.SET_SOURCE_CONFIG, payload };
}

// 设置当前模块配置
export function ActionSetCurrentModule(
  payload: TypeSCModuleConf
): TypeActionSetCurrentModule {
  return { type: ACTION_TYPES.SET_SOURCE_CONFIG_MODULE, payload };
}

// 设置当前页面配置
export function ActionSetCurrentPage(
  payload: TypeSCPageConf
): TypeActionSetCurrentPage {
  return { type: ACTION_TYPES.SET_SOURCE_CONFIG_PAGE, payload };
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
