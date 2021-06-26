import ACTION_TYPES from "@/store/actions";
import { updateState } from "@/store/utils";
import { TypeBrandConf } from "types/project";
import {
  TypeSourceConfig,
  TypeSourceDescription,
  TypeSourceModuleConf,
  TypeSourcePageConf
} from "types/source-config";
import { TypeActions } from "./action";

// main states
export type TypeStates = {
  brandConfList: TypeBrandConf[];
  descriptionList: TypeSourceDescription[];
  currentConfig: TypeSourceConfig | null;
  currentBrandConf: TypeBrandConf | null;
  currentModule: TypeSourceModuleConf | null;
  currentPage: TypeSourcePageConf | null;
};

// 通用的数据
const templateState: TypeStates = {
  // 品牌列表
  brandConfList: [],
  // 配置预览列表
  descriptionList: [],
  currentConfig: null,
  currentBrandConf: null,
  currentModule: null,
  currentPage: null
};

export default function TemplateReducer(
  state: TypeStates = templateState,
  action: TypeActions
): TypeStates {
  switch (action.type) {
    case ACTION_TYPES.SET_BRAND_LIST: {
      return updateState(state, { brandConfList: action.brandConfList });
    }
    case ACTION_TYPES.SET_SOURCE_CONFIG: {
      return updateState(state, { currentConfig: action.payload });
    }
    case ACTION_TYPES.SET_SOURCE_DESCRIPTION_LIST: {
      return updateState(state, { descriptionList: action.payload });
    }
    case ACTION_TYPES.SET_SELECTED_BRAND: {
      return updateState(state, { currentBrandConf: action.brandInfo });
    }
    case ACTION_TYPES.SET_SOURCE_CONFIG_MODULE: {
      return updateState(state, { currentModule: action.payload });
    }
    case ACTION_TYPES.SET_SOURCE_CONFIG_PAGE: {
      return updateState(state, { currentPage: action.payload });
    }
    default:
      return state;
  }
}
