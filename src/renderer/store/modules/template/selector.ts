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

// 获取模板列表
export const getTemplateList = createSelector(
  getTemplateState,
  state => state.templateList
);

// 获取当前模块
export const getSelectedModule = createSelector(
  getTemplateState,
  state => state.currentModule
);

// 获取当前页面
export const getSelectedPage = createSelector(
  getTemplateState,
  state => state.currentPage
);
