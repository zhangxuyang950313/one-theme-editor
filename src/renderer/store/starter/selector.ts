import { createSelector } from "reselect";
import { TypeStarterState } from "@/store/index";

// 数据
const selectStarterState = (state: TypeStarterState) => state;

// 获取场景列表
export const selectScenarioOptionList = createSelector(
  selectStarterState,
  state => state.scenarioOptionList
);

// 获取前选择的场景信息
export const selectScenarioOption = createSelector(
  selectStarterState,
  state => state.scenarioOptionSelected
);

export const selectSourceOptionList = createSelector(
  selectStarterState,
  state => state.sourceOptionList
);

export const selectSourceOption = createSelector(
  selectStarterState,
  state => state.sourceOptionSelected
);

export const selectProjectList = createSelector(
  selectStarterState,
  state => state.projectList
);
