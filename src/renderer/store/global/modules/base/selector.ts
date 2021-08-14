import { createSelector } from "reselect";
import { TypeGlobalState } from "@/store/index";

// 基础通用数据
const getState = (state: TypeGlobalState) => state.base;

// 获取当前服务端口
export const getServerPort = createSelector(getState, state => state.port);

// 获取路径配置信息
export const getAppPath = createSelector(getState, state => state.appPath);

export const getSourceConfigDir = createSelector(
  getAppPath,
  state => state.SOURCE_CONFIG_DIR || ""
);
