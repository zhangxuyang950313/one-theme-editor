import { createSelector } from "reselect";
import store, { TypeStoreState } from "@/store/index";
import { UPDATE_BRAND_INFO, UPDATE_BRAND_INFO_LIST } from "@/store/actions";
import { TypeBrandInfo } from "@/types/project";
import { TypeSelectorResult } from "./../../utils";

// 基础通用数据
const getNormalizedState = (state: TypeStoreState) => state.normalizedState;

// 厂商品牌列表
export const getBrandInfoList = createSelector(getNormalizedState, state => {
  return [
    state.brandInfoList,
    (brandInfoList: TypeBrandInfo[]) => {
      store.dispatch({ type: UPDATE_BRAND_INFO_LIST, brandInfoList });
    }
  ] as TypeSelectorResult<TypeBrandInfo[]>;
});

// 当前选择的厂商品牌
export const getBrandInfo = createSelector(getNormalizedState, state => {
  return [
    state.selectiveBrandInfo,
    (brandInfo: TypeBrandInfo) => {
      store.dispatch({ type: UPDATE_BRAND_INFO, brandInfo });
    }
  ] as TypeSelectorResult<TypeBrandInfo>;
});
