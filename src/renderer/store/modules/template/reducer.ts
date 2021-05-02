import ACTION_TYPES from "@/store/actions";
import { updateState } from "@/store/utils";
import { initialBrand } from "@/config/editor";
import { TypeBrandInfo, TypeTemplateConf } from "src/types/project";
import { TypeActions } from "./action";

// main states
export type TypeStates = {
  brandInfoList: TypeBrandInfo[];
  selectedBrandInfo: TypeBrandInfo;
  templateList: TypeTemplateConf[];
};

// 通用的数据
const templateState: TypeStates = {
  // 品牌列表
  brandInfoList: [initialBrand],
  // 手机品牌信息
  selectedBrandInfo: initialBrand,
  // 模板列表
  templateList: []
};

export default function TemplateReducer(
  state: TypeStates = templateState,
  action: TypeActions
): TypeStates {
  switch (action.type) {
    // 更新品牌信息列表
    case ACTION_TYPES.SET_BRAND_INFO_LIST: {
      return updateState(state, { brandInfoList: action.brandInfoList });
    }
    // 更新选择的手机品牌信息
    case ACTION_TYPES.SET_BRAND_INFO: {
      return updateState(state, { selectedBrandInfo: action.brandInfo });
    }
    // 更新模板列表
    case ACTION_TYPES.SET_TEMPLATE_LIST: {
      return updateState(state, { templateList: action.templateList });
    }
    default:
      return state;
  }
}
