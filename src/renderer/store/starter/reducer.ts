import { updateState } from "@/store/utils";
import { TypeResourceOption } from "src/types/resource.config";
import { TypeScenarioOption } from "src/types/scenario.config";
import { TypeProjectDataDoc } from "src/types/project";
import { ResourceOption } from "src/data/ResourceConfig";
import { ScenarioOption } from "src/data/ScenarioConfig";
import { ACTION_TYPES, TypeStarterActions } from "./action";

export type TypeStarterState = {
  scenarioOptionList: TypeScenarioOption[];
  scenarioSelected: TypeScenarioOption;
  resourceOptionList: TypeResourceOption[];
  resourceSelected: TypeResourceOption;
  projectList: TypeProjectDataDoc[];
};

const starterState: TypeStarterState = {
  scenarioOptionList: [],
  scenarioSelected: ScenarioOption.default,
  resourceOptionList: [],
  resourceSelected: ResourceOption.default,
  projectList: []
};

export default function StarterReducer(
  state: TypeStarterState = starterState,
  action: TypeStarterActions
): TypeStarterState {
  switch (action.type) {
    case ACTION_TYPES.SET_SCENARIO_LIST: {
      return updateState(state, {
        scenarioSelected: action.payload[0],
        scenarioOptionList: action.payload
      });
    }
    case ACTION_TYPES.SET_SCENARIO_SELECTED: {
      return updateState(state, {
        scenarioSelected: action.payload
      });
    }
    case ACTION_TYPES.SET_RESOURCE_LIST: {
      return updateState(state, {
        resourceOptionList: action.payload,
        resourceSelected: action.payload[0] || ResourceOption.default
      });
    }
    case ACTION_TYPES.SET_RESOURCE_SELECTED: {
      return updateState(state, {
        resourceSelected: action.payload
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
