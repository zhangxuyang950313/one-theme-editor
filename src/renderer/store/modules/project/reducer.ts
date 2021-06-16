import ACTION_TYPES from "@/store/actions";
import { updateState } from "@/store/utils";
import { TypeProjectDataInDoc } from "types/project";
import { TypeActions } from "./action";

const defaultState: TypeProjectDataInDoc = {
  uuid: null,
  brand: null,
  description: null,
  uiVersion: null,
  template: null,
  imageDataList: [],
  imageMapperList: [],
  _id: "",
  createAt: undefined,
  updateAt: undefined
};

const projectState: TypeProjectDataInDoc = { ...defaultState };

export default function ProjectReducer(
  state: TypeProjectDataInDoc = projectState,
  action: TypeActions
): TypeProjectDataInDoc {
  switch (action.type) {
    case ACTION_TYPES.INIT_PROJECT: {
      return defaultState;
    }
    case ACTION_TYPES.SET_PROJECT: {
      return updateState(state, { ...action.payload });
    }
    // 添加图片资源
    case ACTION_TYPES.ADD_IMAGE_MAPPER: {
      if (!action.payload) return state;
      return updateState(state, {
        imageMapperList: state.imageMapperList
          // 覆盖重复的
          .filter(o => o.target !== action.payload.target)
          .concat(action.payload)
      });
    }
    // 删除图片资源
    case ACTION_TYPES.DEL_IMAGE_MAPPER: {
      return updateState(state, {
        imageMapperList: state.imageMapperList.filter(
          item => action.payload.target !== item.target
        )
      });
    }
    // case ACTION_TYPES.SET_PROJECT_BRAND_INFO: {
    //   return updateState(state, { brandInfo: action.brandInfo });
    // }
    // case ACTION_TYPES.SET_PROJECT_UI_VERSION: {
    //   return updateState(state, { uiVersion: action.uiVersion });
    // }
    // case ACTION_TYPES.SET_PROJECT_DESC_INFO: {
    //   return updateState(state, { description: action.info });
    // }
    // case ACTION_TYPES.SET_PROJECT_TEMP_CONF: {
    //   return updateState(state, { templateConf: action.tempConf });
    // }
    // case ACTION_TYPES.SET_PROJECT_PREVIEW_CONF: {
    //   return updateState(state, { previewConf: action.previewConf });
    // }
    // case ACTION_TYPES.SET_PROJECT_PAGE_CONF_DATA: {
    //   return updateState(state, { pageConfData: action.pageConfData });
    // }
    default: {
      return state;
    }
  }
}
