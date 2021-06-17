import ACTION_TYPES from "@/store/actions";
import { TypeBrandConf } from "types/project";
import { TypeTempModuleConf, TypeTempPageConf } from "types/template";

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

type TypeActionSetTempModuleConf = {
  type: typeof ACTION_TYPES.SET_TEMP_MODULE_CONF;
  payload: TypeTempModuleConf[];
};

type TypeActionSetTempPageConf = {
  type: typeof ACTION_TYPES.SET_TEMP_PAGE_CONF;
  payload: TypeTempPageConf[];
};

type TypeActionSetSelectedModule = {
  type: typeof ACTION_TYPES.SET_SELECTED_MODULE;
  payload: TypeTempModuleConf;
};

type TypeActionSetSelectedPage = {
  type: typeof ACTION_TYPES.SET_SELECTED_PAGE;
  payload: TypeTempPageConf;
};

// main actions
export type TypeActions =
  | TypeActionSetBrandInfo
  | TypeSetBrandInfoList
  | TypeActionSetTempModuleConf
  | TypeActionSetTempPageConf
  | TypeActionSetSelectedModule
  | TypeActionSetSelectedPage;

// 设置厂商信息列表
export function setBrandInfoList(
  brandInfoList: TypeBrandConf[]
): TypeSetBrandInfoList {
  return { type: ACTION_TYPES.SET_BRAND_LIST, brandInfoList };
}

// 设置选择的厂商信息
export function updateSelectedBrand(
  brandInfo: TypeBrandConf
): TypeActionSetBrandInfo {
  return { type: ACTION_TYPES.SET_SELECTED_BRAND, brandInfo };
}

// 设置当前模板模块信息
export function setTempModuleConf(
  payload: TypeTempModuleConf[]
): TypeActionSetTempModuleConf {
  return { type: ACTION_TYPES.SET_TEMP_MODULE_CONF, payload };
}

// 设置当前模板页面信息
export function setTempPageConf(
  payload: TypeTempPageConf[]
): TypeActionSetTempPageConf {
  return { type: ACTION_TYPES.SET_TEMP_PAGE_CONF, payload };
}

// 更新当前选择的模块
export function setSelectedModule(
  payload: TypeTempModuleConf
): TypeActionSetSelectedModule {
  return { type: ACTION_TYPES.SET_SELECTED_MODULE, payload };
}

// 更新当前选择的页面
export function setSelectedPage(
  payload: TypeTempPageConf
): TypeActionSetSelectedPage {
  return { type: ACTION_TYPES.SET_SELECTED_PAGE, payload };
}
