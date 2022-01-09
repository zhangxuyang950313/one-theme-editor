import type { TypeFileData } from "src/types/file-data";
import type { TypeScenarioConfig } from "src/types/config.scenario";
import type {
  TypeResourceConfig,
  TypePageConfig
} from "src/types/config.resource";
import type { TypeProjectDataDoc, TypeProjectInfo } from "src/types/project";

export enum ACTION_TYPE {
  // 初始化
  INIT_EDITOR = "INIT_EDITOR",
  // 设置工程新数据
  SET_PROJECT_DATA = "SET_PROJECT_DATA",
  // 设置工程描述数据
  SET_PROJECT_INFO = "SET_PROJECT_INFO",
  // 设置场景配置
  SET_SCENARIO_CONFIG = "SET_SCENARIO_CONFIG",
  // 设置资源配置
  SET_RESOURCE_CONFIG = "SET_RESOURCE_CONFIG",
  // 设置当前选中的 key path
  SET_FOCUS_KEY_PATH = "SET_FOCUS_KEY_PATH",
  // 添加页面配置数据映射
  PATCH_PAGE_CONFIG = "PATCH_PAGE_CONFIG",
  // 添加 xml 文件数据
  PATCH_FILE_DATA = "PATCH_FILE_DATA"
}

type TypeActionInitEditor = {
  type: typeof ACTION_TYPE.INIT_EDITOR;
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

type TypeActionSetScenarioConfig = {
  type: typeof ACTION_TYPE.SET_SCENARIO_CONFIG;
  payload: TypeScenarioConfig;
};

type TypeActionSetResourceConfig = {
  type: typeof ACTION_TYPE.SET_RESOURCE_CONFIG;
  payload: TypeResourceConfig;
};

type TypeActionSetFocusKeyPath = {
  type: typeof ACTION_TYPE.SET_FOCUS_KEY_PATH;
  payload: {
    keyPath: string;
    ignoreDuplicate?: boolean;
  };
};

// 更新页面配置表
type TypeActionPatchPageConfMap = {
  type: typeof ACTION_TYPE.PATCH_PAGE_CONFIG;
  payload: TypePageConfig;
};

type TypeActionPatchFileDataMap = {
  type: typeof ACTION_TYPE.PATCH_FILE_DATA;
  payload: { src: string; fileData: TypeFileData | null };
};

// main actions
export type TypeEditorActions =
  | TypeActionInitEditor
  | TypeActionSetProjectData
  | TypeActionSetProjectInfo
  | TypeActionSetScenarioConfig
  | TypeActionSetResourceConfig
  | TypeActionSetFocusKeyPath
  | TypeActionPatchPageConfMap
  | TypeActionPatchFileDataMap;

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

export function ActionSetFocusKeyPath(
  payload: TypeActionSetFocusKeyPath["payload"]
): TypeActionSetFocusKeyPath {
  return { type: ACTION_TYPE.SET_FOCUS_KEY_PATH, payload };
}

// 更新页面数据表
export function ActionPatchPageConfMap(
  payload: TypePageConfig
): TypeActionPatchPageConfMap {
  return { type: ACTION_TYPE.PATCH_PAGE_CONFIG, payload };
}

export function ActionPatchFileDataMap(
  payload: TypeActionPatchFileDataMap["payload"]
): TypeActionPatchFileDataMap {
  return { type: ACTION_TYPE.PATCH_FILE_DATA, payload };
}
