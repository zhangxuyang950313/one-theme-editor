import { createSelector } from "reselect";
import { TypeStoreState } from "../../index";

// 基础通用数据
const getBaseState = (state: TypeStoreState) => state.base;

// 标题栏标题
export const getWindowTitle = createSelector(
  getBaseState,
  state => state.windowTitle
);
