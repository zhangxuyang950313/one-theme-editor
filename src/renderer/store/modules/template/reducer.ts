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
  selectedBrand: TypeBrandConf | null;
  selectedModule: TypeTempModuleConf | null;
  selectedPage: TypeTempPageConf | null;
  templateList: TypeTemplateInfo[];
};

// 通用的数据
const templateState: TypeStates = {
  // 品牌列表
  brandInfoList: [],
  // 选择的手机品牌信息
  selectedBrand: null,
  selectedModule: null,
  selectedPage: null,
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
      return updateState(state, { selectedBrand: action.brandInfo });
    }
    case ACTION_TYPES.SET_SELECTED_MODULE: {
      return updateState(state, { selectedModule: action.payload || null });
    }
    case ACTION_TYPES.SET_SELECTED_PAGE: {
      return updateState(state, { selectedPage: action.payload || null });
    }
    default:
      return state;
  }
}
