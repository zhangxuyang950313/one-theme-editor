import { TypeBrandOption, TypeSourceConfigInfo } from "src/types/source";

export enum ACTION_TYPES {
  // 设置厂商品牌列表
  SET_BRAND_OPTION_LIST = "SET_BRAND_OPTION_LIST",
  // 设置当前选择的厂商
  SET_BRAND_OPTION = "SET_BRAND_OPTION",
  // 设置资源预览列表
  SET_SOURCE_BRIEF_LIST = "SET_SOURCE_BRIEF_LIST"
}

// 设置品牌信息列表
type TypeSetBrandOptionList = {
  type: typeof ACTION_TYPES.SET_BRAND_OPTION_LIST;
  brandOptionList: TypeBrandOption[];
};

// 配置描述列表
type TypeActionSetSourceDescriptionList = {
  type: typeof ACTION_TYPES.SET_SOURCE_BRIEF_LIST;
  payload: TypeSourceConfigInfo[];
};

// 设置品牌信息
type TypeActionSetBrandOption = {
  type: typeof ACTION_TYPES.SET_BRAND_OPTION;
  payload: TypeBrandOption;
};

// main actions
export type TypeStarterActions =
  | TypeSetBrandOptionList
  | TypeActionSetSourceDescriptionList
  | TypeActionSetBrandOption;

// 设置厂商信息列表
export function ActionSetBrandOptionList(
  brandConfList: TypeBrandOption[]
): TypeSetBrandOptionList {
  return {
    type: ACTION_TYPES.SET_BRAND_OPTION_LIST,
    brandOptionList: brandConfList
  };
}

// 设置当前资源配置预览列表
export function ActionSetSourceDescriptionList(
  payload: TypeSourceConfigInfo[]
): TypeActionSetSourceDescriptionList {
  return { type: ACTION_TYPES.SET_SOURCE_BRIEF_LIST, payload };
}

// 设置选择的厂商信息
export function ActionSetBrandOption(
  brandOption: TypeBrandOption
): TypeActionSetBrandOption {
  return { type: ACTION_TYPES.SET_BRAND_OPTION, payload: brandOption };
}
