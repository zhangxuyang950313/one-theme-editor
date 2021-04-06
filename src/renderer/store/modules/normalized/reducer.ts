// import { brandConfig } from "@/config";
import { UPDATE_BRAND_INFO, UPDATE_BRAND_INFO_LIST } from "@/store/actions";
import { updateState } from "@/store/utils";
import { TypeBrandInfo } from "@/types/project";

// 更新品牌信息列表
type TypeUpdateBrandInfoList = {
  type: typeof UPDATE_BRAND_INFO_LIST;
  brandInfoList: TypeBrandInfo[];
};

// 更新品牌信息
type TypeUpdateBrandInfo = {
  type: typeof UPDATE_BRAND_INFO;
  brandInfo: TypeBrandInfo;
};

export type TypeState = {
  brandInfoList: TypeBrandInfo[];
  selectiveBrandInfo: Partial<TypeBrandInfo>;
};

type TypeActions = TypeUpdateBrandInfo | TypeUpdateBrandInfoList;

// 通用的数据
const normalizedState: TypeState = {
  // 品牌列表
  brandInfoList: [],
  // 手机品牌信息
  selectiveBrandInfo: {}
};

export default function Base(
  state: TypeState = normalizedState,
  action: TypeActions
): TypeState {
  switch (action.type) {
    // 更新品牌信息列表
    case UPDATE_BRAND_INFO_LIST: {
      return updateState(state, { brandInfoList: action.brandInfoList });
    }
    // 更新选择的手机品牌信息
    case UPDATE_BRAND_INFO: {
      return updateState(state, { selectiveBrandInfo: action.brandInfo });
    }
    default:
      return state;
  }
}
