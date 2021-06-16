import ACTION_TYPES from "@/store/actions";
import { updateState } from "@/store/utils";
import { TypeBrandConf } from "types/project";
import {
  TypeTemplateInfo,
  TypeTempModuleConf,
  TypeTempPageConf
} from "types/template";
import { TypeActions } from "./action";

// main states
export type TypeStates = {
  brandInfoList: TypeBrandConf[];
  currentBrand: TypeBrandConf | null;
  currentModule: TypeTempModuleConf | null;
  currentPage: TypeTempPageConf | null;
  templateList: TypeTemplateInfo[];
};

// 通用的数据
const templateState: TypeStates = {
  // 品牌列表
  brandInfoList: [],

  currentBrand: null,
  currentModule: null,
  currentPage: null,
  // 模板列表
  templateList: []
};

export default function TemplateReducer(
  state: TypeStates = templateState,
  action: TypeActions
): TypeStates {
  switch (action.type) {
    // 更新品牌信息列表
    case ACTION_TYPES.SET_BRAND_LIST: {
      return updateState(state, { brandInfoList: action.brandInfoList });
    }
    // 更新选择的手机品牌信息
    case ACTION_TYPES.SET_SELECTED_BRAND: {
      return updateState(state, { currentBrand: action.brandInfo });
    }
    case ACTION_TYPES.SET_SELECTED_MODULE: {
      return updateState(state, { currentModule: action.payload || null });
    }
    case ACTION_TYPES.SET_SELECTED_PAGE: {
      return updateState(state, { currentPage: action.payload || null });
    }
    default:
      return state;
  }
}
