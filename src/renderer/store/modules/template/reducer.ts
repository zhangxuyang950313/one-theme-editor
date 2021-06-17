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
  currentTemplate: TypeTemplateInfo | null;
  currentBrand: TypeBrandConf | null;
  currentModule: TypeTempModuleConf | null;
  currentPage: TypeTempPageConf | null;
};

// 通用的数据
const templateState: TypeStates = {
  // 品牌列表
  brandInfoList: [],
  // 当前模板信息
  currentTemplate: null,
  currentBrand: null,
  currentModule: null,
  currentPage: null
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
    case ACTION_TYPES.SET_SELECTED_BRAND: {
      return updateState(state, { currentBrand: action.brandInfo });
    }

    case ACTION_TYPES.SET_CURRENT_TEMPLATE: {
      return updateState(state, { currentTemplate: action.payload });
    }
    case ACTION_TYPES.SET_CURRENT_MODULE: {
      return updateState(state, { currentModule: action.payload });
    }
    case ACTION_TYPES.SET_CURRENT_PAGE: {
      return updateState(state, { currentPage: action.payload });
    }
    default:
      return state;
  }
}
