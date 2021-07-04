import { updateState } from "@/store/utils";
import { TypeBrandConf } from "types/project";
import { TypeSourceDescription } from "types/source-config";
import ACTION_TYPES from "@/store/actions";
import { TypeStarterActions } from "./action";

// main states
export type TypeStarterState = {
  brandConfList: TypeBrandConf[];
  descriptionList: TypeSourceDescription[];
  currentBrandConf: TypeBrandConf | null;
};

// 通用的数据
const starterState: TypeStarterState = {
  // 品牌列表
  brandConfList: [],
  // 配置预览列表
  descriptionList: [],
  currentBrandConf: null
};

export default function TemplateReducer(
  state: TypeStarterState = starterState,
  action: TypeStarterActions
): TypeStarterState {
  switch (action.type) {
    case ACTION_TYPES.SET_BRAND_LIST: {
      return updateState(state, { brandConfList: action.brandConfList });
    }
    case ACTION_TYPES.SET_SOURCE_DESC_LIST: {
      return updateState(state, { descriptionList: action.payload });
    }
    case ACTION_TYPES.SET_CURRENT_BRAND: {
      return updateState(state, { currentBrandConf: action.payload });
    }
    default:
      return state;
  }
}
