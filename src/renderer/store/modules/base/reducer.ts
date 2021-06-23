import ACTION_TYPES from "@/store/actions";
import { updateState } from "@/store/utils";
import { TypeActions } from "./action";

const BaseState = {
  port: 30000
};

export type TypeBaseState = typeof BaseState;

export default function BaseReducer(
  state: TypeBaseState = BaseState,
  action: TypeActions
): TypeBaseState {
  switch (action.type) {
    case ACTION_TYPES.SET_SERVER_PORT: {
      return updateState(state, { port: Number(action.payload) || 30000 });
    }
    default:
      return state;
  }
}
