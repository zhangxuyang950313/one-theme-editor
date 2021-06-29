import { createSelector } from "reselect";
import { TypeStoreState } from "@/store/index";

// 基础通用数据
const getBaseState = (state: TypeStoreState) => state.base;

// 获取当前服务端口
export const getServerPort = createSelector(getBaseState, state => state.port);

// 获取路径配置信息
export const getPathConfig = createSelector(
  getBaseState,
  state => state.pathConfig
);
