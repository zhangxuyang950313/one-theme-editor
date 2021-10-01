import { TypeProjectDataDoc } from "src/types/project";
import { TypeScenarioOption, TypeResourceOption } from "src/types/resource";

export enum ACTION_TYPES {
  SET_SCENARIO_OPTION_LIST = "SET_SCENARIO_OPTION_LIST", // 场景列表
  SET_SCENARIO_OPTION_SELECTED = "SET_SCENARIO_OPTION_SELECTED", // 当前选择的场景
  SET_SOURCE_OPTION_LIST = "SET_SOURCE_OPTION_LIST", // 资源配置选项列表
  SET_SOURCE_OPTION_SELECTED = "SET_SOURCE_OPTION_SELECTED", // 当前选择的资源配置选项
  SET_PROJECT_LIST = "SET_PROJECT_LIST" // 工程列表
}

// 设置场景信息列表
type TypeActionSetScenarioOptionList = {
  type: typeof ACTION_TYPES.SET_SCENARIO_OPTION_LIST;
  payload: TypeScenarioOption[];
};

// 设置场景信息
type TypeActionSetScenarioOption = {
  type: typeof ACTION_TYPES.SET_SCENARIO_OPTION_SELECTED;
  payload: TypeScenarioOption;
};

type TypeActionSetSourceOptionList = {
  type: typeof ACTION_TYPES.SET_SOURCE_OPTION_LIST;
  payload: TypeResourceOption[];
};

type TypeActionSetSourceOption = {
  type: typeof ACTION_TYPES.SET_SOURCE_OPTION_SELECTED;
  payload: TypeResourceOption;
};

type TypeActionSetProjectList = {
  type: typeof ACTION_TYPES.SET_PROJECT_LIST;
  payload: TypeProjectDataDoc[];
};

// main actions
export type TypeStarterActions =
  | TypeActionSetScenarioOptionList
  | TypeActionSetScenarioOption
  | TypeActionSetSourceOptionList
  | TypeActionSetSourceOption
  | TypeActionSetProjectList;

// 设置场景信息列表
export function ActionSetScenarioOptionList(
  payload: TypeScenarioOption[]
): TypeActionSetScenarioOptionList {
  return { type: ACTION_TYPES.SET_SCENARIO_OPTION_LIST, payload };
}

// 设置选择的场景信息
export function ActionSetScenarioOption(
  payload: TypeScenarioOption
): TypeActionSetScenarioOption {
  return { type: ACTION_TYPES.SET_SCENARIO_OPTION_SELECTED, payload };
}

export function ActionSetSourceOptionList(
  payload: TypeResourceOption[]
): TypeActionSetSourceOptionList {
  return { type: ACTION_TYPES.SET_SOURCE_OPTION_LIST, payload };
}

export function ActionSetSourceOption(
  payload: TypeResourceOption
): TypeActionSetSourceOption {
  return { type: ACTION_TYPES.SET_SOURCE_OPTION_SELECTED, payload };
}

export function ActionSetProjectList(
  payload: TypeProjectDataDoc[]
): TypeActionSetProjectList {
  return { type: ACTION_TYPES.SET_PROJECT_LIST, payload };
}
