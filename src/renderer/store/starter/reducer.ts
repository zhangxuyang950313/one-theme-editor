import { updateState } from "@/store/utils";
import { TypeScenarioOption, TypeResourceOption } from "src/types/resource";
import { TypeProjectDataDoc } from "src/types/project";
import { ResourceOption } from "src/data/ResourceConfig";
import { ScenarioOption } from "src/data/ScenarioConfig";
import { ACTION_TYPES, TypeStarterActions } from "./action";

export type TypeStarterState = {
  scenarioOptionList: TypeScenarioOption[];
  scenarioOptionSelected: TypeScenarioOption;
  resourceOptionList: TypeResourceOption[];
  resourceOptionSelected: TypeResourceOption;
  projectList: TypeProjectDataDoc[];
};

const starterState: TypeStarterState = {
  scenarioOptionList: [],
  scenarioOptionSelected: ScenarioOption.default,
  resourceOptionList: [],
  resourceOptionSelected: ResourceOption.default,
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
        resourceOptionList: action.payload,
        resourceOptionSelected: action.payload[0]
      });
    }
    case ACTION_TYPES.SET_SOURCE_OPTION_SELECTED: {
      return updateState(state, {
        resourceOptionSelected: action.payload
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
