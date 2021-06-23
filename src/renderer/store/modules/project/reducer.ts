import ACTION_TYPES from "@/store/actions";
import { updateState } from "@/store/utils";
import { TypeProjectStateInStore } from "types/project";
import { TypeActions } from "./action";

const defaultState: TypeProjectStateInStore = {};

const projectState: TypeProjectStateInStore = { ...defaultState };

export default function ProjectReducer(
  state: TypeProjectStateInStore = projectState,
  action: TypeActions
): TypeProjectStateInStore {
  switch (action.type) {
    case ACTION_TYPES.INIT_PROJECT: {
      return defaultState;
    }
    case ACTION_TYPES.SET_PROJECT_DATA: {
      return action.payload;
    }
    case ACTION_TYPES.SET_PROJECT_DESCRIPTION: {
      return updateState(state, { description: action.payload });
    }
    case ACTION_TYPES.SET_IMAGE_MAPPER_LIST: {
      return updateState(state, { imageMapperList: action.payload });
    }
    default: {
      return state;
    }
  }
}
