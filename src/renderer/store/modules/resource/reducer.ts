import ACTION_TYPES from "@/store/actions";
import { updateState } from "@/store/utils";
import { TypeResourceImage, TypeResourceXml } from "types/project";
import { TypeActions } from "./action";

export type TypeStates = {
  imageList: TypeResourceImage[];
  xmlList: TypeResourceXml[];
};

const defaultState: TypeStates = {
  imageList: [],
  xmlList: []
};

const resourceState: TypeStates = { ...defaultState };

export default function ResourceReducer(
  state: TypeStates = resourceState,
  action: TypeActions
): TypeStates {
  switch (action.type) {
    // 添加图片资源
    case ACTION_TYPES.ADD_RESOURCE: {
      return updateState(state, {
        imageList: [...state.imageList, action.payload]
      });
    }
    // 删除图片资源
    case ACTION_TYPES.DEL_RESOURCE: {
      return updateState(state, {
        imageList: state.imageList.filter(
          item => action.payload.target !== item.target
        )
      });
    }
    default: {
      return state;
    }
  }
}
