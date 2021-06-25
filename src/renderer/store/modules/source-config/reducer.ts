import ACTION_TYPES from "@/store/actions";
import { updateState } from "@/store/utils";
import { TypeBrandConf } from "types/project";
import {
  TypeSourceConfig,
  TypeSourceModuleConf,
  TypeSourcePageConf
} from "types/source-config";
import { TypeActions } from "./action";

// main states
export type TypeStates = {
  templateLocalPath: string | null;
  brandConfList: TypeBrandConf[];
  currentBrandConf: TypeBrandConf | null;
  currentConfig: TypeSourceConfig | null;
  currentModule: TypeSourceModuleConf | null;
  currentPage: TypeSourcePageConf | null;
};

// 通用的数据
const templateState: TypeStates = {
  // 本地模板路径
  templateLocalPath: null,
  // 品牌列表
  brandConfList: [],
  currentBrandConf: null,
  // 当前模板信息
  currentConfig: null,
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
      return updateState(state, { brandConfList: action.brandConfList });
    }
    case ACTION_TYPES.SET_SELECTED_BRAND: {
      return updateState(state, { currentBrandConf: action.brandInfo });
    }
    case ACTION_TYPES.SET_SOURCE_DESCRIPTION: {
      return updateState(state, { currentConfig: action.payload });
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
