import {
  TypeBrandInfo,
  TypePageConf,
  TypePreviewConf,
  TypeProjectInfo,
  TypeTemplateConf,
  TypeUiVersionConf
} from "@/types/project";
import {
  INIT_PROJECT,
  SET_PROJECT_BRAND_INFO,
  SET_PROJECT_DESC_INFO,
  SET_PROJECT_PREVIEW_CONF,
  SET_PROJECT_PAGE_CONF_DATA,
  SET_PROJECT_TEMP_CONF,
  SET_PROJECT_UI_VERSION
} from "@/store/actions";
import { updateState } from "@/store/utils";
import { TypeActions } from "./action";

export type TypeStates = {
  brandInfo: TypeBrandInfo | null;
  uiVersion: TypeUiVersionConf | null;
  projectInfo: TypeProjectInfo | null;
  templateConf: TypeTemplateConf | null;
  previewConf: TypePreviewConf | null;
  pageConfData: TypePageConf[];
};

const defaultState: TypeStates = {
  brandInfo: null,
  uiVersion: null,
  projectInfo: null,
  templateConf: null,
  previewConf: null,
  pageConfData: []
};

const projectState: TypeStates = { ...defaultState };

export default function ProjectReducer(
  state: TypeStates = projectState,
  action: TypeActions
): TypeStates {
  switch (action.type) {
    case INIT_PROJECT: {
      return defaultState;
    }
    case SET_PROJECT_BRAND_INFO: {
      return updateState(state, { brandInfo: action.brandInfo });
    }
    case SET_PROJECT_UI_VERSION: {
      return updateState(state, { uiVersion: action.uiVersion });
    }
    case SET_PROJECT_DESC_INFO: {
      return updateState(state, { projectInfo: action.info });
    }
    case SET_PROJECT_TEMP_CONF: {
      return updateState(state, { templateConf: action.tempConf });
    }
    case SET_PROJECT_PREVIEW_CONF: {
      return updateState(state, { previewConf: action.previewConf });
    }
    case SET_PROJECT_PAGE_CONF_DATA: {
      return updateState(state, { pageConfData: action.pageConfData });
    }
    default: {
      return state;
    }
  }
}
