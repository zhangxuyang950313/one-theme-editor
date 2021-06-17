import { createSelector } from "reselect";
import { TypeStoreState } from "@/store/index";

// 数据
const getTemplateState = (state: TypeStoreState) => state.template;

// 获取厂商信息列表
export const getBrandInfoList = createSelector(
  getTemplateState,
  state => state.brandInfoList
);

// 获取前选择的厂商信息
export const getSelectedBrand = createSelector(
  getTemplateState,
  state => state.currentBrand
);

// 获取当前模板
export const getCurrentTemplate = createSelector(
  getTemplateState,
  state => state.currentTemplate
);

// 获取模块列表
export const getCurrentModuleList = createSelector(
  getCurrentTemplate,
  state => state?.modules || []
);

// 获取当前模块
export const getCurrentModule = createSelector(
  getTemplateState,
  state => state.currentModule
);

// 获取页面组列表
export const getCurrentPageGroupList = createSelector(
  getCurrentModule,
  state => state?.groups || []
);

// 获取当前页面
export const getCurrentPage = createSelector(
  getTemplateState,
  state => state.currentPage
);
