import BrandOption from "src/data/BrandOption";
import { updateState } from "@/store/utils";
import { TypeBrandOption, TypeSourceOption } from "src/types/source";
import { TypeProjectDataDoc } from "src/types/project";
import { SourceOption } from "src/data/SourceConfig";
import { ACTION_TYPES, TypeStarterActions } from "./action";

export type TypeStarterState = {
  brandOptionList: TypeBrandOption[];
  brandOptionSelected: TypeBrandOption;
  sourceOptionList: TypeSourceOption[];
  sourceOptionSelected: TypeSourceOption;
  projectList: TypeProjectDataDoc[];
};

const starterState: TypeStarterState = {
  brandOptionList: [],
  brandOptionSelected: BrandOption.default,
  sourceOptionList: [],
  sourceOptionSelected: SourceOption.default,
  projectList: []
};

export default function StarterReducer(
  state: TypeStarterState = starterState,
  action: TypeStarterActions
): TypeStarterState {
  switch (action.type) {
    case ACTION_TYPES.SET_BRAND_OPTION_LIST: {
      return updateState(state, {
        brandOptionSelected: action.payload[0],
        brandOptionList: action.payload
      });
    }
    case ACTION_TYPES.SET_BRAND_OPTION_SELECTED: {
      return updateState(state, {
        brandOptionSelected: action.payload
      });
    }
    case ACTION_TYPES.SET_SOURCE_OPTION_LIST: {
      return updateState(state, {
        sourceOptionSelected: action.payload[0],
        sourceOptionList: action.payload
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
