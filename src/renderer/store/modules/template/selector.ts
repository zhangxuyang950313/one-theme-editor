import { createSelector } from "reselect";
import { TypeStoreState } from "@/store/index";

// 数据
const getState = (state: TypeStoreState) => state.templateState;

// 获取厂商信息列表
export const getBrandInfoList = createSelector(
  getState,
  state => state.brandInfoList
);

// 获取前选择的厂商信息
export const getBrandInfo = createSelector(
  getState,
  state => state.selectedBrandInfo
);

// 获取模板列表
export const getTemplateList = createSelector(
  getState,
  state => state.templateList
);
