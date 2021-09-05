import { createSelector } from "reselect";
import { TypeStarterState } from "@/store/index";

// 数据
const getStarterState = (state: TypeStarterState) => state;

// 获取品牌信息列表
export const getBrandConfigList = createSelector(
  getStarterState,
  state => state.brandOptionList
);

// 获取前选择的品牌信息
export const getBrandConfig = createSelector(getStarterState, state => {
  return state.brandOption;
});
