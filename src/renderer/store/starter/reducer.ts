import { updateState } from "@/store/utils";
import { TypeSourceConfigInfo } from "types/source-config";
import { DataBrandConf } from "src/data-model/DataBrandConfig";
import { ACTION_TYPES, TypeStarterActions } from "./action";

// main states
export type TypeStarterState = {
  sourceConfigInfoList: TypeSourceConfigInfo[];
  brandConfList: DataBrandConf[];
  brandConf: DataBrandConf;
};

// 通用的数据
const starterState: TypeStarterState = {
  // 配置预览列表
  sourceConfigInfoList: [],
  // 品牌列表
  brandConfList: [],
  brandConf: new DataBrandConf()
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
