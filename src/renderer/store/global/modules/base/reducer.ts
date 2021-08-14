import ACTION_TYPES from "@/store/global/actionType";
import { updateState } from "@/store/utils";
import { TypePathConfig } from "types/extraConfig";
import AppPath from "data/AppPath";
import { TypeActions } from "./action";

type TypeBaseState = {
  port: number;
  appPath: TypePathConfig;
};

const baseState: Required<TypeBaseState> = {
  port: 30000,
  appPath: new AppPath().create()
};

export default function BaseReducer(
  state = baseState,
  action: TypeActions
): TypeBaseState {
  switch (action.type) {
    case ACTION_TYPES.SET_SERVER_PORT: {
      return updateState(state, { port: Number(action.payload) ?? 30000 });
    }
    case ACTION_TYPES.SET_APP_PATH: {
      return updateState(state, { appPath: action.payload });
    }
    default:
      return state;
  }
}
