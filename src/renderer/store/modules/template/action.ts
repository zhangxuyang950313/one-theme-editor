import ACTION_TYPES from "@/store/actions";
import { TypeBrandConf, TypeTemplateInfo } from "src/types/project";

// 更新品牌信息列表
type TypeSetBrandInfoList = {
  type: typeof ACTION_TYPES.SET_BRAND_INFO_LIST;
  brandInfoList: TypeBrandConf[];
};

// 更新品牌信息
type TypeSetBrandInfo = {
  type: typeof ACTION_TYPES.SET_BRAND_INFO;
  brandInfo: TypeBrandConf;
};

// 模板列表
type TypeSetTemplateList = {
  type: typeof ACTION_TYPES.SET_TEMPLATE_LIST;
  templateList: TypeTemplateInfo[];
};

// main actions
export type TypeActions =
  | TypeSetBrandInfo
  | TypeSetBrandInfoList
  | TypeSetTemplateList;

// 设置厂商信息列表
export function setBrandInfoList(
  brandInfoList: TypeBrandConf[]
): TypeSetBrandInfoList {
  return { type: ACTION_TYPES.SET_BRAND_INFO_LIST, brandInfoList };
}

// 设置选择的厂商信息
export function setBrandInfo(brandInfo: TypeBrandConf): TypeSetBrandInfo {
  return { type: ACTION_TYPES.SET_BRAND_INFO, brandInfo };
}

export function setTemplateList(
  templateList: TypeTemplateInfo[]
): TypeSetTemplateList {
  return { type: ACTION_TYPES.SET_TEMPLATE_LIST, templateList };
}
