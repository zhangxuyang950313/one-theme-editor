import {
  SET_BRAND_INFO,
  SET_BRAND_INFO_LIST,
  SET_TEMPLATE_LIST
} from "@/store/actions";
import { TypeBrandInfo, TypeTemplateConf } from "@/types/project";

// 更新品牌信息列表
type TypeSetBrandInfoList = {
  type: typeof SET_BRAND_INFO_LIST;
  brandInfoList: TypeBrandInfo[];
};

// 更新品牌信息
type TypeSetBrandInfo = {
  type: typeof SET_BRAND_INFO;
  brandInfo: TypeBrandInfo;
};

// 模板列表
type TypeSetTemplateList = {
  type: typeof SET_TEMPLATE_LIST;
  templateList: TypeTemplateConf[];
};

// main actions
export type TypeActions =
  | TypeSetBrandInfo
  | TypeSetBrandInfoList
  | TypeSetTemplateList;

// 设置厂商信息列表
export function setBrandInfoList(
  brandInfoList: TypeBrandInfo[]
): TypeSetBrandInfoList {
  return { type: SET_BRAND_INFO_LIST, brandInfoList };
}

// 设置选择的厂商信息
export function setBrandInfo(brandInfo: TypeBrandInfo): TypeSetBrandInfo {
  return { type: SET_BRAND_INFO, brandInfo };
}

export function setTemplateList(
  templateList: TypeTemplateConf[]
): TypeSetTemplateList {
  return { type: SET_TEMPLATE_LIST, templateList };
}
