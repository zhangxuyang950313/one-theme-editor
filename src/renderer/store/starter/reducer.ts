import BrandOption from "src/data/BrandOption";
import { updateState } from "@/store/utils";
import { TypeBrandOption } from "src/types/source";
import { TypeProjectDataDoc } from "src/types/project";
import { ACTION_TYPES, TypeStarterActions } from "./action";

// main states
export type TypeStarterState = {
  brandOptionList: TypeBrandOption[];
  brandOption: TypeBrandOption;
  projectList: TypeProjectDataDoc[];
};

// 通用的数据
const starterState: TypeStarterState = {
  // 品牌列表
  brandOptionList: [],
  brandOption: new BrandOption().create(),
  projectList: []
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
    case ACTION_TYPES.SET_PROJECT_LIST: {
      return updateState(state, {
        projectList: action.payload
      });
    }
    default:
      return state;
  }
}
