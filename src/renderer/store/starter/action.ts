import { TypeProjectDataDoc } from "src/types/project";
import { TypeResourceOption } from "src/types/resource.config";
import { TypeScenarioOption } from "src/types/scenario.config";

export enum ACTION_TYPES {
  SET_SCENARIO_LIST = "SET_SCENARIO_LIST", // 场景列表
  SET_SCENARIO_SELECTED = "SET_SCENARIO_SELECTED", // 当前选择的场景
  SET_RESOURCE_LIST = "SET_RESOURCE_LIST", // 资源配置列表
  SET_RESOURCE_SELECTED = "SET_RESOURCE_SELECTED", // 当前选择的资源配置
  SET_PROJECT_LIST = "SET_PROJECT_LIST" // 工程列表
}

// 设置场景信息列表
type TypeActionSetScenarioList = {
  type: typeof ACTION_TYPES.SET_SCENARIO_LIST;
  payload: TypeScenarioOption[];
};

// 设置场景信息
type TypeActionSetScenario = {
  type: typeof ACTION_TYPES.SET_SCENARIO_SELECTED;
  payload: TypeScenarioOption;
};

type TypeActionSetResourceList = {
  type: typeof ACTION_TYPES.SET_RESOURCE_LIST;
  payload: TypeResourceOption[];
};

type TypeActionSetResource = {
  type: typeof ACTION_TYPES.SET_RESOURCE_SELECTED;
  payload: TypeResourceOption;
};

type TypeActionSetProjectList = {
  type: typeof ACTION_TYPES.SET_PROJECT_LIST;
  payload: TypeProjectDataDoc[];
};

// main actions
export type TypeStarterActions =
  | TypeActionSetScenarioList
  | TypeActionSetScenario
  | TypeActionSetResourceList
  | TypeActionSetResource
  | TypeActionSetProjectList;

// 设置场景信息列表
export function ActionSetScenarioOptionList(
  payload: TypeScenarioOption[]
): TypeActionSetScenarioList {
  return { type: ACTION_TYPES.SET_SCENARIO_LIST, payload };
}

// 设置选择的场景信息
export function ActionSetScenarioOption(
  payload: TypeScenarioOption
): TypeActionSetScenario {
  return { type: ACTION_TYPES.SET_SCENARIO_SELECTED, payload };
}

export function ActionSetResourceOptionList(
  payload: TypeResourceOption[]
): TypeActionSetResourceList {
  return { type: ACTION_TYPES.SET_RESOURCE_LIST, payload };
}

export function ActionSetResourceOption(
  payload: TypeResourceOption
): TypeActionSetResource {
  return { type: ACTION_TYPES.SET_RESOURCE_SELECTED, payload };
}

export function ActionSetProjectList(
  payload: TypeProjectDataDoc[]
): TypeActionSetProjectList {
  return { type: ACTION_TYPES.SET_PROJECT_LIST, payload };
}
