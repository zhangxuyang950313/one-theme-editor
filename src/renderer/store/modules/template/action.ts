import ACTION_TYPES from "@/store/actions";
import { TypeBrandConf } from "types/project";
import {
  TypeTemplateInfo,
  TypeTempModuleConf,
  TypeTempPageConf
} from "types/template";

// 更新品牌信息列表
type TypeSetBrandInfoList = {
  type: typeof ACTION_TYPES.SET_BRAND_LIST;
  brandInfoList: TypeBrandConf[];
};

// 更新品牌信息
type TypeActionSetBrandInfo = {
  type: typeof ACTION_TYPES.SET_SELECTED_BRAND;
  brandInfo: TypeBrandConf;
};

type TypeActionSetCurrentTemplate = {
  type: typeof ACTION_TYPES.SET_CURRENT_TEMPLATE;
  payload: TypeTemplateInfo;
};

type TypeActionSetCurrentModule = {
  type: typeof ACTION_TYPES.SET_CURRENT_MODULE;
  payload: TypeTempModuleConf;
};

type TypeActionSetCurrentPage = {
  type: typeof ACTION_TYPES.SET_CURRENT_PAGE;
  payload: TypeTempPageConf;
};

// main actions
export type TypeActions =
  | TypeSetBrandInfoList
  | TypeActionSetBrandInfo
  | TypeActionSetCurrentTemplate
  | TypeActionSetCurrentModule
  | TypeActionSetCurrentPage;

// 设置厂商信息列表
export function setBrandInfoList(
  brandInfoList: TypeBrandConf[]
): TypeSetBrandInfoList {
  return { type: ACTION_TYPES.SET_BRAND_LIST, brandInfoList };
}

// 设置选择的厂商信息
export function setSelectedBrand(
  brandInfo: TypeBrandConf
): TypeActionSetBrandInfo {
  return { type: ACTION_TYPES.SET_SELECTED_BRAND, brandInfo };
}

// 更新当前选择的模块
export function setCurrentBrand(
  payload: TypeTempModuleConf
): TypeActionSetCurrentModule {
  return { type: ACTION_TYPES.SET_CURRENT_MODULE, payload };
}

// 更新当前选择的页面
export function setCurrentPage(
  payload: TypeTempPageConf
): TypeActionSetCurrentPage {
  return { type: ACTION_TYPES.SET_CURRENT_PAGE, payload };
}
