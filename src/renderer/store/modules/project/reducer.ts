import ACTION_TYPES from "@/store/actions";
import { updateState } from "@/store/utils";
import {
  TypeBrandInfo,
  TypeDatabase,
  TypeProjectData,
  TypeProjectDesc,
  TypeResourceMap
} from "types/project";
import { TypeActions } from "./action";

export type TypeStates = {
  brandInfo: TypeBrandInfo | null;
  projectData: TypeDatabase<TypeProjectData> | null;
  projectInfo: TypeProjectDesc | null;
  resourceMapList: TypeResourceMap[];
  // uiVersion: TypeUiVersionConf | null;
  // projectInfo: TypeProjectDesc | null;
  // templateConf: TypeTemplateInfo | null;
  // previewConf: TypeTemplateConf | null;
  // pageConfData: TypePageConf[];
};

const defaultState: TypeStates = {
  brandInfo: null,
  projectData: null,
  projectInfo: null,
  resourceMapList: []
  // uiVersion: null,
  // projectInfo: null,
  // templateConf: null,
  // previewConf: null,
  // pageConfData: []
};

const projectState: TypeStates = { ...defaultState };

export default function ProjectReducer(
  state: TypeStates = projectState,
  action: TypeActions
): TypeStates {
  switch (action.type) {
    case ACTION_TYPES.INIT_PROJECT: {
      return defaultState;
    }
    case ACTION_TYPES.SET_PROJECT: {
      return updateState(state, {
        brandInfo: action.payload?.brand || null,
        projectData: action.payload || null,
        projectInfo: action.payload.projectInfo || null
      });
    }
    // case ACTION_TYPES.SET_PROJECT_BRAND_INFO: {
    //   return updateState(state, { brandInfo: action.brandInfo });
    // }
    // case ACTION_TYPES.SET_PROJECT_UI_VERSION: {
    //   return updateState(state, { uiVersion: action.uiVersion });
    // }
    // case ACTION_TYPES.SET_PROJECT_DESC_INFO: {
    //   return updateState(state, { projectInfo: action.info });
    // }
    // case ACTION_TYPES.SET_PROJECT_TEMP_CONF: {
    //   return updateState(state, { templateConf: action.tempConf });
    // }
    // case ACTION_TYPES.SET_PROJECT_PREVIEW_CONF: {
    //   return updateState(state, { previewConf: action.previewConf });
    // }
    // case ACTION_TYPES.SET_PROJECT_PAGE_CONF_DATA: {
    //   return updateState(state, { pageConfData: action.pageConfData });
    // }
    default: {
      return state;
    }
  }
}
