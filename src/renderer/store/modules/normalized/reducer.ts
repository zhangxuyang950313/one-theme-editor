import { brandConfig } from "@/config";
import { UPDATE_BRAND_INFO } from "@/store/actions";
import { updateState } from "@/store/utils";
import { TypeBrandInfo } from "@/types/project";

type TypeUpdateBrandInfo = {
  type: typeof UPDATE_BRAND_INFO;
  brandInfo: TypeBrandInfo;
};

type TypeActions = TypeUpdateBrandInfo;

// 通用的数据
const normalizedState: {
  selectiveBrandInfo: TypeBrandInfo;
} = {
  // 手机品牌信息
  selectiveBrandInfo: brandConfig[0]
};

export type TypeBaseState = typeof normalizedState;

export default function Base(
  state: TypeBaseState = normalizedState,
  action: TypeActions
): TypeBaseState {
  switch (action.type) {
    // 更新选择的手机品牌信息
    case UPDATE_BRAND_INFO: {
      return updateState(state, { selectiveBrandInfo: action.brandInfo });
    }
    default:
      return state;
  }
}
