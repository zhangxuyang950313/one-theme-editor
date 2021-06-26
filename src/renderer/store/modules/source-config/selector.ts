import path from "path";
import { createSelector } from "reselect";
import { TypeStoreState } from "@/store/index";

// 数据
const getSourceConfigState = (state: TypeStoreState) => state.sourceConfig;

const getBaseState = (state: TypeStoreState) => state.base;

// 获取厂商信息列表
export const getBrandInfoList = createSelector(
  getSourceConfigState,
  state => state.brandConfList
);

// 获取前选择的厂商信息
export const getSelectedBrandConf = createSelector(
  getSourceConfigState,
  state => state.currentBrandConf
);

// 获取当前资源配置信息
export const getCurrentSourceConfig = createSelector(
  getSourceConfigState,
  state => state.currentConfig
);

// 获取模块列表
export const getCurrentModuleList = createSelector(
  getCurrentSourceConfig,
  state => state?.modules || []
);

// 获取当前模块
export const getCurrentModule = createSelector(
  getSourceConfigState,
  state => state.currentModule
);

// 获取页面组列表
export const getCurrentPageGroupList = createSelector(
  getCurrentModule,
  state => state?.groups || []
);

// 获取当前页面
export const getCurrentPage = createSelector(
  getSourceConfigState,
  state => state.currentPage
);

// 获取当前资源配置根目录
export const getCurrentSourceConfigRoot = createSelector(
  (state: TypeStoreState) => state,
  state =>
    path.join(
      state.base.pathConfig?.SOURCE_CONFIG_DIR || "",
      state.sourceConfig.currentConfig?.namespace || ""
    )
);
