import * as PATH_CONFIG from "server/core/pathUtils";
import { updateState } from "@/store/utils";
import ACTION_TYPES from "@/store/actions";
import { TypeActions } from "./action";

type TypeBaseState = {
  port: number;
  pathConfig: typeof PATH_CONFIG | null;
};

const baseState: TypeBaseState = {
  port: 30000,
  pathConfig: null
};

export default function BaseReducer(
  state = baseState,
  action: TypeActions
): TypeBaseState {
  switch (action.type) {
    case ACTION_TYPES.SET_SERVER_PORT: {
      return updateState(state, { port: Number(action.payload) || 30000 });
    }
    case ACTION_TYPES.SET_PATH_CONFIG: {
      return updateState(state, { pathConfig: action.payload });
    }
    default:
      return state;
  }
}
