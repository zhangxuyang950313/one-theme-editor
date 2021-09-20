import { updateState } from "@/store/utils";
import { TypeScenarioOption, TypeSourceOption } from "src/types/source";
import { TypeProjectDataDoc } from "src/types/project";
import { SourceOption } from "src/data/SourceConfig";
import { ScenarioOption } from "src/data/ScenarioConfig";
import { ACTION_TYPES, TypeStarterActions } from "./action";

export type TypeStarterState = {
  scenarioOptionList: TypeScenarioOption[];
  scenarioOptionSelected: TypeScenarioOption;
  sourceOptionList: TypeSourceOption[];
  sourceOptionSelected: TypeSourceOption;
  projectList: TypeProjectDataDoc[];
};

const starterState: TypeStarterState = {
  scenarioOptionList: [],
  scenarioOptionSelected: ScenarioOption.default,
  sourceOptionList: [],
  sourceOptionSelected: SourceOption.default,
  projectList: []
};

export default function StarterReducer(
  state: TypeStarterState = starterState,
  action: TypeStarterActions
): TypeStarterState {
  switch (action.type) {
    case ACTION_TYPES.SET_SCENARIO_OPTION_LIST: {
      return updateState(state, {
        scenarioOptionSelected: action.payload[0],
        scenarioOptionList: action.payload
      });
    }
    case ACTION_TYPES.SET_SCENARIO_OPTION_SELECTED: {
      return updateState(state, {
        scenarioOptionSelected: action.payload
      });
    }
    case ACTION_TYPES.SET_SOURCE_OPTION_LIST: {
      return updateState(state, {
        sourceOptionList: action.payload,
        sourceOptionSelected: action.payload[0]
      });
    }
    case ACTION_TYPES.SET_SOURCE_OPTION_SELECTED: {
      return updateState(state, {
        sourceOptionSelected: action.payload
      });
    }
    case ACTION_TYPES.SET_PROJECT_LIST: {
      return updateState(state, {
        projectList: action.payload
      });
    }
    default:
      return state;
  }
}
