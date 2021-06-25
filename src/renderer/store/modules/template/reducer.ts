import ACTION_TYPES from "@/store/actions";
import { updateState } from "@/store/utils";
import { TypeBrandConf } from "types/project";
import {
  TypeTemplateData,
  TypeTempModuleConf,
  TypeTempPageConf
} from "types/template";
import { TypeActions } from "./action";

// main states
export type TypeStates = {
  templateLocalPath: string | null;
  brandInfoList: TypeBrandConf[];
  currentBrand: TypeBrandConf | null;
  currentTemplate: TypeTemplateData | null;
  currentModule: TypeTempModuleConf | null;
  currentPage: TypeTempPageConf | null;
};

// 通用的数据
const templateState: TypeStates = {
  // 本地模板路径
  templateLocalPath: null,
  // 品牌列表
  brandInfoList: [],
  currentBrand: null,
  // 当前模板信息
  currentTemplate: null,
  currentModule: null,
  currentPage: null
};

export default function TemplateReducer(
  state: TypeStates = templateState,
  action: TypeActions
): TypeStates {
  switch (action.type) {
    case ACTION_TYPES.SET_TEMPLATE_PATH: {
      return updateState(state, { templateLocalPath: action.payload });
    }
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
