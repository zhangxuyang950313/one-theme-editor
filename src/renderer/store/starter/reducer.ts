import BrandOption from "src/data/BrandOption";
import { updateState } from "@/store/utils";
import { TypeBrandOption, TypeSourceConfigPreview } from "src/types/source";
import { ACTION_TYPES, TypeStarterActions } from "./action";

// main states
export type TypeStarterState = {
  sourceConfigInfoList: TypeSourceConfigPreview[];
  brandOptionList: TypeBrandOption[];
  brandOption: TypeBrandOption;
};

// 通用的数据
const starterState: TypeStarterState = {
  // 配置预览列表
  sourceConfigInfoList: [],
  // 品牌列表
  brandOptionList: [],
  brandOption: new BrandOption().create()
};

export default function TemplateReducer(
  state: TypeStarterState = starterState,
  action: TypeStarterActions
): TypeStarterState {
  switch (action.type) {
    case ACTION_TYPES.SET_BRAND_OPTION_LIST: {
      return updateState(state, {
        brandOption: action.payload[0],
        brandOptionList: action.payload
      });
    }
    case ACTION_TYPES.SET_BRAND_OPTION: {
      return updateState(state, {
        brandOption: action.payload
      });
    }
    case ACTION_TYPES.SET_SOURCE_BRIEF_LIST: {
      return updateState(state, {
        sourceConfigInfoList: action.payload
      });
    }
    default:
      return state;
  }
}
