import ACTION_TYPES from "@/store/actions";
import { TypeBrandConf } from "src/types/project";

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

// main actions
export type TypeActions = TypeActionSetBrandInfo | TypeSetBrandInfoList;

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
