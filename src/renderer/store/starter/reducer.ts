import { updateState } from "@/store/utils";
import { TypeBrandConf } from "types/project";
import { TypeSourceConfigInfo } from "types/source";
import { BrandConf } from "src/data/BrandConfig";
import { ACTION_TYPES, TypeStarterActions } from "./action";

// main states
export type TypeStarterState = {
  sourceConfigInfoList: TypeSourceConfigInfo[];
  brandConfList: TypeBrandConf[];
  brandConf: TypeBrandConf;
};

// 通用的数据
const starterState: TypeStarterState = {
  // 配置预览列表
  sourceConfigInfoList: [],
  // 品牌列表
  brandConfList: [],
  brandConf: BrandConf.default()
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
        sourceConfigInfoList: action.payload
      });
    }
    default:
      return state;
  }
}
