import { createSelector } from "reselect";
import store, { TypeStoreState } from "@/store/index";
import { UPDATE_BRAND_INFO } from "@/store/actions";
import { TypeBrandInfo } from "@/types/project";
import { TypeSelectorResult } from "./../../utils";

// 基础通用数据
const getNormalizedState = (state: TypeStoreState) => state.normalizedState;

// 当前品牌信息
export const getBrandInfo = createSelector(getNormalizedState, state => {
  return [
    state.selectiveBrandInfo,
    (brandInfo: TypeBrandInfo) => {
      store.dispatch({ type: UPDATE_BRAND_INFO, brandInfo });
    }
  ] as TypeSelectorResult<TypeBrandInfo>;
});
