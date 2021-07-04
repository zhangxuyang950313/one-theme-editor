import { createSelector } from "reselect";
import { TypeStarterState } from "@/store/index";

// 数据
const getStarterState = (state: TypeStarterState) => state;

// 获取厂商信息列表
export const getBrandInfoList = createSelector(
  getStarterState,
  state => state.brandConfList
);

// 获取前选择的厂商信息
export const getCurrentBrandConf = createSelector(getStarterState, state => {
  return state.currentBrandConf;
});
