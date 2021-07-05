import { updateState } from "@/store/utils";
import { TypeBrandConf } from "types/project";
import { TypeSourceConfigBrief } from "types/source-config";
import { ACTION_TYPES, TypeStarterActions } from "./action";

// main states
export type TypeStarterState = {
  sourceConfigBriefList: TypeSourceConfigBrief[];
  brandConfList: TypeBrandConf[];
  brandConf: TypeBrandConf | null;
};

// 通用的数据
const starterState: TypeStarterState = {
  // 配置预览列表
  sourceConfigBriefList: [],
  // 品牌列表
  brandConfList: [],
  brandConf: null
};

export default function TemplateReducer(
  state: TypeStarterState = starterState,
  action: TypeStarterActions
): TypeStarterState {
  switch (action.type) {
    case ACTION_TYPES.SET_BRAND_CONF_LIST: {
      return updateState(state, {
        brandConf: action.brandConfList[0],
        brandConfList: action.brandConfList
      });
    }
    case ACTION_TYPES.SET_BRAND_CONF: {
      return updateState(state, {
        brandConf: action.payload
      });
    }
    case ACTION_TYPES.SET_SOURCE_BRIEF_LIST: {
      return updateState(state, {
        sourceConfigBriefList: action.payload
      });
    }
    default:
      return state;
  }
}
