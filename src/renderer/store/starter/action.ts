import { TypeProjectDataDoc } from "src/types/project";
import { TypeBrandOption } from "src/types/source";

export enum ACTION_TYPES {
  // 设置品牌列表
  SET_BRAND_OPTION_LIST = "SET_BRAND_OPTION_LIST",
  // 设置当前选择的品牌
  SET_BRAND_OPTION = "SET_BRAND_OPTION",
  SET_PROJECT_LIST = "SET_PROJECT_LIST"
}

// 设置品牌信息列表
type TypeActionSetBrandOptionList = {
  type: typeof ACTION_TYPES.SET_BRAND_OPTION_LIST;
  payload: TypeBrandOption[];
};

// 设置品牌信息
type TypeActionSetBrandOption = {
  type: typeof ACTION_TYPES.SET_BRAND_OPTION;
  payload: TypeBrandOption;
};

type TypeActionSetProjectList = {
  type: typeof ACTION_TYPES.SET_PROJECT_LIST;
  payload: TypeProjectDataDoc[];
};

// main actions
export type TypeStarterActions =
  | TypeActionSetBrandOptionList
  | TypeActionSetBrandOption
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
  return { type: ACTION_TYPES.SET_BRAND_OPTION, payload };
}

export function ActionSetProjectList(
  payload: TypeProjectDataDoc[]
): TypeActionSetProjectList {
  return { type: ACTION_TYPES.SET_PROJECT_LIST, payload };
}
