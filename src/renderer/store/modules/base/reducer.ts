import ACTION_TYPES from "@/store/actions";
import { updateState } from "@/store/utils";
import { TypeActions } from "./action";

const BaseState = {
  windowTitle: document.title
};

export type TypeBaseState = typeof BaseState;

export default function BaseReducer(
  state: TypeBaseState = BaseState,
  action: TypeActions
): TypeBaseState {
  switch (action.type) {
    case ACTION_TYPES.SET_WINDOW_TITLE: {
      document.title = action.title;
      return updateState(state, { windowTitle: action.title });
    }
    default:
      return state;
  }
}
