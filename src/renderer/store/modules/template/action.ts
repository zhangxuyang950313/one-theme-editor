import ACTION_TYPES from "@/store/actions";
import { TypeBrandConf } from "types/project";
import {
  TypeTemplateData,
  TypeTempModuleConf,
  TypeTempPageConf
} from "types/sourceConfig";

// 设置模板路径
type TypeSetTemplatePath = {
  type: typeof ACTION_TYPES.SET_TEMPLATE_PATH;
  payload: string;
};

// 设置品牌信息列表
type TypeSetBrandInfoList = {
  type: typeof ACTION_TYPES.SET_BRAND_LIST;
  brandInfoList: TypeBrandConf[];
};

// 设置品牌信息
type TypeActionSetBrandInfo = {
  type: typeof ACTION_TYPES.SET_SELECTED_BRAND;
  brandInfo: TypeBrandConf;
};

// 设置模板
type TypeActionSetCurrentTemplate = {
  type: typeof ACTION_TYPES.SET_CURRENT_TEMPLATE;
  payload: TypeTemplateData;
};

// 设置模块
type TypeActionSetCurrentModule = {
  type: typeof ACTION_TYPES.SET_CURRENT_MODULE;
  payload: TypeTempModuleConf;
};

// 设置页面
type TypeActionSetCurrentPage = {
  type: typeof ACTION_TYPES.SET_CURRENT_PAGE;
  payload: TypeTempPageConf;
};

// main actions
export type TypeActions =
  | TypeSetTemplatePath
  | TypeSetBrandInfoList
  | TypeActionSetBrandInfo
  | TypeActionSetCurrentTemplate
  | TypeActionSetCurrentModule
  | TypeActionSetCurrentPage;

// 设置模板路径
export function ActionSetTemplatePath(payload: string): TypeSetTemplatePath {
  return { type: ACTION_TYPES.SET_TEMPLATE_PATH, payload };
}

// 设置厂商信息列表
export function ActionSetBrandInfoList(
  brandInfoList: TypeBrandConf[]
): TypeSetBrandInfoList {
  return { type: ACTION_TYPES.SET_BRAND_LIST, brandInfoList };
}

// 设置选择的厂商信息
export function ActionSetSelectedBrand(
  brandInfo: TypeBrandConf
): TypeActionSetBrandInfo {
  return { type: ACTION_TYPES.SET_SELECTED_BRAND, brandInfo };
}

// 设置当前模板
export function ActionSetCurrentTemplate(
  payload: TypeTemplateData
): TypeActionSetCurrentTemplate {
  return { type: ACTION_TYPES.SET_CURRENT_TEMPLATE, payload };
}

// 设置当前模块配置
export function ActionSetCurrentBrand(
  payload: TypeTempModuleConf
): TypeActionSetCurrentModule {
  return { type: ACTION_TYPES.SET_CURRENT_MODULE, payload };
}

// 设置当前页面配置
export function ActionSetCurrentPage(
  payload: TypeTempPageConf
): TypeActionSetCurrentPage {
  return { type: ACTION_TYPES.SET_CURRENT_PAGE, payload };
}
