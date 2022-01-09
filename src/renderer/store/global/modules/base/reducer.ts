import PathCollection from "src/data/PathCollection";

import type { TypePathCollection } from "src/types/config.extra";

import type { TypeActions } from "./action";

import { updateState } from "@/store/utils";
import ACTION_TYPES from "@/store/global/actionType";

type TypeBaseState = {
  port: number;
  appPath: TypePathCollection;
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
    case ACTION_TYPES.SET_PATH_CONFIG: {
      return updateState(state, { appPath: action.payload });
    }
    default:
      return state;
  }
}
