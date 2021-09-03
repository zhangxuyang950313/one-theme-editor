import { createSelector } from "reselect";
import { TypeStarterState } from "@/store/index";

// 数据
const getStarterState = (state: TypeStarterState) => state;

// 获取厂商信息列表
export const getBrandOptionList = createSelector(
  getStarterState,
  state => state.brandOptionList
);

// 获取前选择的厂商信息
export const getBrandOption = createSelector(getStarterState, state => {
  return state.brandOption;
});
