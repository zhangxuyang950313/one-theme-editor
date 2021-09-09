import { TypeProjectDataDoc } from "src/types/project";
import { TypeBrandOption, TypeSourceOption } from "src/types/source";

export enum ACTION_TYPES {
  SET_BRAND_OPTION_LIST = "SET_BRAND_OPTION_LIST", // 品牌列表
  SET_BRAND_OPTION_SELECTED = "SET_BRAND_OPTION_SELECTED", // 当前选择的品牌
  SET_SOURCE_OPTION_LIST = "SET_SOURCE_OPTION_LIST", // 资源配置选项列表
  SET_SOURCE_OPTION_SELECTED = "SET_SOURCE_OPTION_SELECTED", // 当前选择的资源配置选项
  SET_PROJECT_LIST = "SET_PROJECT_LIST" // 工程列表
}

// 设置品牌信息列表
type TypeActionSetBrandOptionList = {
  type: typeof ACTION_TYPES.SET_BRAND_OPTION_LIST;
  payload: TypeBrandOption[];
};

// 设置品牌信息
type TypeActionSetBrandOption = {
  type: typeof ACTION_TYPES.SET_BRAND_OPTION_SELECTED;
  payload: TypeBrandOption;
};

type TypeActionSetSourceOptionList = {
  type: typeof ACTION_TYPES.SET_SOURCE_OPTION_LIST;
  payload: TypeSourceOption[];
};

type TypeActionSetSourceOption = {
  type: typeof ACTION_TYPES.SET_SOURCE_OPTION_SELECTED;
  payload: TypeSourceOption;
};

type TypeActionSetProjectList = {
  type: typeof ACTION_TYPES.SET_PROJECT_LIST;
  payload: TypeProjectDataDoc[];
};

// main actions
export type TypeStarterActions =
  | TypeActionSetBrandOptionList
  | TypeActionSetBrandOption
  | TypeActionSetSourceOptionList
  | TypeActionSetSourceOption
  | TypeActionSetProjectList;

// 设置品牌信息列表
export function ActionSetBrandOptionList(
  payload: TypeBrandOption[]
): TypeActionSetBrandOptionList {
  return { type: ACTION_TYPES.SET_BRAND_OPTION_LIST, payload };
}

// 设置选择的品牌信息
export function ActionSetBrandOption(
  payload: TypeBrandOption
): TypeActionSetBrandOption {
  return { type: ACTION_TYPES.SET_BRAND_OPTION_SELECTED, payload };
}

export function ActionSetSourceOptionList(
  payload: TypeSourceOption[]
): TypeActionSetSourceOptionList {
  return { type: ACTION_TYPES.SET_SOURCE_OPTION_LIST, payload };
}

export function ActionSetSourceOption(
  payload: TypeSourceOption
): TypeActionSetSourceOption {
  return { type: ACTION_TYPES.SET_SOURCE_OPTION_SELECTED, payload };
}

export function ActionSetProjectList(
  payload: TypeProjectDataDoc[]
): TypeActionSetProjectList {
  return { type: ACTION_TYPES.SET_PROJECT_LIST, payload };
}
