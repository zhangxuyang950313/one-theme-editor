import ACTION_TYPES from "@/store/global/actionType";
import { updateState } from "@/store/utils";
import { TypePathConfig } from "src/types/extraConfig";
import PathCollection from "src/data/PathCollection";
import { TypeActions } from "./action";

type TypeBaseState = {
  port: number;
  appPath: TypePathConfig;
};

const baseState: Required<TypeBaseState> = {
  port: 0,
  appPath: PathCollection.default
};

export default function BaseReducer(
  state = baseState,
  action: TypeActions
): TypeBaseState {
  switch (action.type) {
    case ACTION_TYPES.SET_SERVER_PORT: {
      return updateState(state, { port: Number(action.payload) ?? 0 });
    }
    case ACTION_TYPES.SET_APP_PATH: {
      return updateState(state, { appPath: action.payload });
    }
    default:
      return state;
  }
}
