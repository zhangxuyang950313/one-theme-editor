import { TypeScenarioOption } from "src/types/config.scenario";
import ScenarioOption from "src/data/ScenarioOption";
import { ACTION_TYPES, TypeStarterActions } from "./action";
import { updateState } from "@/store/utils";

export type TypeStarterState = {
  scenarioSelected: TypeScenarioOption;
};

const starterState: TypeStarterState = {
  scenarioSelected: ScenarioOption.default
};

export default function StarterReducer(
  state: TypeStarterState = starterState,
  action: TypeStarterActions
): TypeStarterState {
  switch (action.type) {
    case ACTION_TYPES.SET_SCENARIO_SELECTED: {
      return updateState(state, {
        scenarioSelected: action.payload
      });
    }
    default:
      return state;
  }
}
