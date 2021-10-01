import { updateState } from "@/store/utils";
import { TypeScenarioOption, TypeResourceOption } from "src/types/resource";
import { TypeProjectDataDoc } from "src/types/project";
import { ResourceOption } from "src/data/ResourceConfig";
import { ScenarioOption } from "src/data/ScenarioConfig";
import { ACTION_TYPES, TypeStarterActions } from "./action";

export type TypeStarterState = {
  scenarioList: TypeScenarioOption[];
  scenarioSelected: TypeScenarioOption;
  resourceList: TypeResourceOption[];
  resourceSelected: TypeResourceOption;
  projectList: TypeProjectDataDoc[];
};

const starterState: TypeStarterState = {
  scenarioList: [],
  scenarioSelected: ScenarioOption.default,
  resourceList: [],
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
        scenarioList: action.payload
      });
    }
    case ACTION_TYPES.SET_SCENARIO_SELECTED: {
      return updateState(state, {
        scenarioSelected: action.payload
      });
    }
    case ACTION_TYPES.SET_RESOURCE_LIST: {
      return updateState(state, {
        resourceList: action.payload,
        resourceSelected: action.payload[0]
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
