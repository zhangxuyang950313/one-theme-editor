import ACTION_TYPES from "@/store/actions";
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
    case ACTION_TYPES.SET_PROJECT: {
      return action.payload || defaultState;
    }
    default: {
      return state;
    }
  }
}
