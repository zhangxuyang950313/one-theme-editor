import { TypeBrandConf } from "types/project";
import { TypeSourceConfigInfo } from "types/source-config";

export enum ACTION_TYPES {
  // 设置厂商品牌列表
  SET_BRAND_CONF_LIST = "SET_BRAND_LIST",
  // 设置当前选择的厂商
  SET_BRAND_CONF = "SET_BRAND_CONFIG",
  // 设置资源预览列表
  SET_SOURCE_BRIEF_LIST = "SET_SOURCE_BRIEF_LIST"
}

// 设置品牌信息列表
type TypeSetBrandInfoList = {
  type: typeof ACTION_TYPES.SET_BRAND_CONF_LIST;
  brandConfList: TypeBrandConf[];
};

// 配置描述列表
type TypeActionSetSourceDescriptionList = {
  type: typeof ACTION_TYPES.SET_SOURCE_BRIEF_LIST;
  payload: TypeSourceConfigInfo[];
};

// 设置品牌信息
type TypeActionSetBrandInfo = {
  type: typeof ACTION_TYPES.SET_BRAND_CONF;
  payload: TypeBrandConf;
};

// main actions
export type TypeStarterActions =
  | TypeSetBrandInfoList
  | TypeActionSetSourceDescriptionList
  | TypeActionSetBrandInfo;

// 设置厂商信息列表
export function ActionSetBrandInfoList(
  brandConfList: TypeBrandConf[]
): TypeSetBrandInfoList {
  return { type: ACTION_TYPES.SET_BRAND_CONF_LIST, brandConfList };
}

// 设置当前资源配置预览列表
export function ActionSetSourceDescriptionList(
  payload: TypeSourceConfigInfo[]
): TypeActionSetSourceDescriptionList {
  return { type: ACTION_TYPES.SET_SOURCE_BRIEF_LIST, payload };
}

// 设置选择的厂商信息
export function ActionSetBrandConf(
  brandInfo: TypeBrandConf
): TypeActionSetBrandInfo {
  return { type: ACTION_TYPES.SET_BRAND_CONF, payload: brandInfo };
}
