import { createSelector } from "reselect";
import { TypeStarterState } from "@/store/index";

// 数据
const selectStarterState = (state: TypeStarterState) => state;

// 获取品牌列表
export const selectBrandOptionList = createSelector(
  selectStarterState,
  state => state.brandOptionList
);

// 获取前选择的品牌信息
export const selectBrandConfig = createSelector(
  selectStarterState,
  state => state.brandOption
);

export const selectProjectList = createSelector(
  selectStarterState,
  state => state.projectList
);
