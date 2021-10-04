import {
  TypeProjectDataDoc,
  TypeProjectInfo,
  TypeFileData
} from "src/types/project";
import {
  TypeResourceConfig,
  TypeResModule,
  TypeResPageOption,
  TypeResPageConfig,
  TypeScenarioConfig
} from "src/types/resource";

export enum ACTION_TYPE {
  // 初始化
  INIT_EDITOR = "INIT_EDITOR",
  // 设置资源配置
  SET_RESOURCE_CONFIG = "SET_RESOURCE_CONFIG",
  // 设置场景配置
  SET_SCENARIO_CONFIG = "SET_SCENARIO_CONFIG",
  // 设置模块配置
  SET_MODULE_CONFIG = "SET_MODULE_CONFIG",
  // 设置页面配置
  SET_PAGE_OPTION = "SET_PAGE_OPTION",
  // 添加页面配置数据映射
  PATCH_PAGE_CONFIG = "PATCH_PAGE_CONFIG",
  // 添加工程文件数据映射
  PATCH_FILE_DATA_MAP = "PATCH_FILE_DATA_MAP",
  REMOVE_FILE_DATA_MAP = "REMOVE_FILE_DATA_MAP",

  // 设置工程新数据
  SET_PROJECT_DATA = "SET_PROJECT_DATA",
  // 设置工程描述数据
  SET_PROJECT_INFO = "SET_PROJECT_INFO"
}

type TypeActionInitEditor = {
  type: typeof ACTION_TYPE.INIT_EDITOR;
};

type TypeActionSetResourceConfig = {
  type: typeof ACTION_TYPE.SET_RESOURCE_CONFIG;
  payload: TypeResourceConfig;
};

type TypeActionSetScenarioConfig = {
  type: typeof ACTION_TYPE.SET_SCENARIO_CONFIG;
  payload: TypeScenarioConfig;
};

// 设置模块
type TypeActionSetModuleConf = {
  type: typeof ACTION_TYPE.SET_MODULE_CONFIG;
  payload: TypeResModule;
};

// 设置页面
type TypeActionSetPageConf = {
  type: typeof ACTION_TYPE.SET_PAGE_OPTION;
  payload: TypeResPageOption;
};

// 设置工程数据
type TypeActionSetProjectData = {
  type: typeof ACTION_TYPE.SET_PROJECT_DATA;
  payload: TypeProjectDataDoc;
};

// 设置工程描述信息
type TypeActionSetProjectInfo = {
  type: typeof ACTION_TYPE.SET_PROJECT_INFO;
  payload: TypeProjectInfo;
};

// 更新页面配置表
type TypeActionPatchPageConfMap = {
  type: typeof ACTION_TYPE.PATCH_PAGE_CONFIG;
  payload: TypeResPageConfig;
};

// 更新工程文件数据表
type TypeActionPatchFileDataMap = {
  type: typeof ACTION_TYPE.PATCH_FILE_DATA_MAP;
  payload: TypeFileData;
};

// 删除工程文件数据
type TypeActionRemoveFileDataMap = {
  type: typeof ACTION_TYPE.REMOVE_FILE_DATA_MAP;
  payload: string;
};

// main actions
export type TypeEditorActions =
  | TypeActionInitEditor
  | TypeActionSetScenarioConfig
  | TypeActionSetResourceConfig
  | TypeActionSetModuleConf
  | TypeActionSetPageConf
  | TypeActionSetProjectData
  | TypeActionSetProjectInfo
  | TypeActionPatchPageConfMap
  | TypeActionPatchFileDataMap
  | TypeActionRemoveFileDataMap;

export function ActionInitEditor(): TypeActionInitEditor {
  return { type: ACTION_TYPE.INIT_EDITOR };
}

// 设置当前场景配置
export function ActionSetScenarioConfig(
  payload: TypeScenarioConfig
): TypeActionSetScenarioConfig {
  return { type: ACTION_TYPE.SET_SCENARIO_CONFIG, payload };
}

// 设置当前资源配置
export function ActionSetResourceConfig(
  payload: TypeResourceConfig
): TypeActionSetResourceConfig {
  return { type: ACTION_TYPE.SET_RESOURCE_CONFIG, payload };
}

// 设置当前模块配置
export function ActionSetCurrentModule(
  payload: TypeResModule
): TypeActionSetModuleConf {
  return { type: ACTION_TYPE.SET_MODULE_CONFIG, payload };
}

// 设置当前页面配置
export function ActionSetCurrentPage(
  payload: TypeResPageOption
): TypeActionSetPageConf {
  return { type: ACTION_TYPE.SET_PAGE_OPTION, payload };
}

// 设置工程数据
export function ActionSetProjectData(
  payload: TypeProjectDataDoc
): TypeActionSetProjectData {
  return { type: ACTION_TYPE.SET_PROJECT_DATA, payload };
}

// 设置 description
export function ActionSetDescription(
  payload: TypeProjectInfo
): TypeActionSetProjectInfo {
  return { type: ACTION_TYPE.SET_PROJECT_INFO, payload };
}

// 更新页面数据表
export function ActionPatchPageConfMap(
  payload: TypeResPageConfig
): TypeActionPatchPageConfMap {
  return { type: ACTION_TYPE.PATCH_PAGE_CONFIG, payload };
}

export function ActionPatchFileData(
  payload: TypeFileData
): TypeActionPatchFileDataMap {
  return { type: ACTION_TYPE.PATCH_FILE_DATA_MAP, payload };
}

export function ActionRemoveFileData(
  payload: string
): TypeActionRemoveFileDataMap {
  return { type: ACTION_TYPE.REMOVE_FILE_DATA_MAP, payload };
}
