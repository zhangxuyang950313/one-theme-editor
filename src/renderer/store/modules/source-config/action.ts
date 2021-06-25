import ACTION_TYPES from "@/store/actions";
import { TypeBrandConf } from "types/project";
import {
  TypeSourceConfig,
  TypeSourceDescription,
  TypeSourceModuleConf,
  TypeSourcePageConf
} from "types/source-config";

// 设置品牌信息列表
type TypeSetBrandInfoList = {
  type: typeof ACTION_TYPES.SET_BRAND_LIST;
  brandConfList: TypeBrandConf[];
};

// 设置品牌信息
type TypeActionSetBrandInfo = {
  type: typeof ACTION_TYPES.SET_SELECTED_BRAND;
  brandInfo: TypeBrandConf;
};

type TypeActionSetSourceConfig = {
  type: typeof ACTION_TYPES.SET_SOURCE_CONFIG;
  payload: TypeSourceConfig;
};

type TypeActionSetSourceDescriptionList = {
  type: typeof ACTION_TYPES.SET_SOURCE_DESCRIPTION_LIST;
  payload: TypeSourceDescription[];
};

// 设置素材配置预览
type TypeActionSetSourceDescription = {
  type: typeof ACTION_TYPES.SET_SOURCE_DESCRIPTION;
  payload: TypeSourceDescription;
};

// 设置模块
type TypeActionSetCurrentModule = {
  type: typeof ACTION_TYPES.SET_SOURCE_CONFIG_MODULE;
  payload: TypeSourceModuleConf;
};

// 设置页面
type TypeActionSetCurrentPage = {
  type: typeof ACTION_TYPES.SET_SOURCE_CONFIG_PAGE;
  payload: TypeSourcePageConf;
};

// main actions
export type TypeActions =
  | TypeSetBrandInfoList
  | TypeActionSetSourceDescriptionList
  | TypeActionSetBrandInfo
  | TypeActionSetSourceConfig
  | TypeActionSetSourceDescription
  | TypeActionSetCurrentModule
  | TypeActionSetCurrentPage;

// 设置厂商信息列表
export function ActionSetBrandInfoList(
  brandConfList: TypeBrandConf[]
): TypeSetBrandInfoList {
  return { type: ACTION_TYPES.SET_BRAND_LIST, brandConfList };
}

// 设置选择的厂商信息
export function ActionSetSelectedBrand(
  brandInfo: TypeBrandConf
): TypeActionSetBrandInfo {
  return { type: ACTION_TYPES.SET_SELECTED_BRAND, brandInfo };
}

// 设置当前资源配置预览列表
export function ActionSetSourceDescriptionList(
  payload: TypeSourceDescription[]
): TypeActionSetSourceDescriptionList {
  return { type: ACTION_TYPES.SET_SOURCE_DESCRIPTION_LIST, payload };
}

// 设置当前资源预览配置
export function ActionSetSourceDescription(
  payload: TypeSourceDescription
): TypeActionSetSourceDescription {
  return { type: ACTION_TYPES.SET_SOURCE_DESCRIPTION, payload };
}

// 设置当前模块配置
export function ActionSetCurrentBrand(
  payload: TypeSourceModuleConf
): TypeActionSetCurrentModule {
  return { type: ACTION_TYPES.SET_SOURCE_CONFIG_MODULE, payload };
}

// 设置当前页面配置
export function ActionSetCurrentPage(
  payload: TypeSourcePageConf
): TypeActionSetCurrentPage {
  return { type: ACTION_TYPES.SET_SOURCE_CONFIG_PAGE, payload };
}
