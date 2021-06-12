import ACTION_TYPES from "@/store/actions";
import { updateState } from "@/store/utils";
import { TypeBrandConf, TypeTemplateInfo } from "src/types/project";
import { TypeActions } from "./action";

// main states
export type TypeStates = {
  brandInfoList: TypeBrandConf[];
  selectedBrand: TypeBrandConf | null;
  templateList: TypeTemplateInfo[];
};

// 通用的数据
const templateState: TypeStates = {
  // 品牌列表
  brandInfoList: [],
  // 选择的手机品牌信息
  selectedBrand: null,
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
    default:
      return state;
  }
}
