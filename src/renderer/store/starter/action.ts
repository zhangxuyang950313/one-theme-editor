import { TypeBrandConf } from "types/project";
import { TypeSourceDescription } from "types/source-config";
import ACTION_TYPES from "@/store/actions";

// 设置品牌信息列表
type TypeSetBrandInfoList = {
  type: typeof ACTION_TYPES.SET_BRAND_LIST;
  brandConfList: TypeBrandConf[];
};

// 配置描述列表
type TypeActionSetSourceDescriptionList = {
  type: typeof ACTION_TYPES.SET_SOURCE_DESC_LIST;
  payload: TypeSourceDescription[];
};

// 设置品牌信息
type TypeActionSetBrandInfo = {
  type: typeof ACTION_TYPES.SET_CURRENT_BRAND;
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
  return { type: ACTION_TYPES.SET_BRAND_LIST, brandConfList };
}

// 设置当前资源配置预览列表
export function ActionSetSourceDescriptionList(
  payload: TypeSourceDescription[]
): TypeActionSetSourceDescriptionList {
  return { type: ACTION_TYPES.SET_SOURCE_DESC_LIST, payload };
}

// 设置选择的厂商信息
export function ActionSetCurrentBrand(
  brandInfo: TypeBrandConf
): TypeActionSetBrandInfo {
  return { type: ACTION_TYPES.SET_CURRENT_BRAND, payload: brandInfo };
}
