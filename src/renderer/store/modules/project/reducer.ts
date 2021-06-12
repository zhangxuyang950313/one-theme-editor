import { TypeTempModuleConf, TypeTempPageConf } from "types/project";
import {
  TypeBrandConf,
  TypeDatabase,
  // TypePageConf,
  // TypeTemplateConf,
  // TypeProjectDesc,
  // TypeTemplateInfo,
  // TypeUiVersionConf,
  TypeProjectData
} from "src/types/project";
import ACTION_TYPES from "@/store/actions";
import { updateState } from "@/store/utils";
// import { updateProjectById } from "@/api";
import { TypeActions } from "./action";

export type TypeStates = {
  brandInfo: TypeBrandConf | null;
  projectData: TypeDatabase<TypeProjectData> | null;
  selectedModule: TypeTempModuleConf | null;
  selectedPage: TypeTempPageConf | null;
  // uiVersion: TypeUiVersionConf | null;
  // projectInfo: TypeProjectDesc | null;
  // templateConf: TypeTemplateInfo | null;
  // previewConf: TypeTemplateConf | null;
  // pageConfData: TypePageConf[];
};

const defaultState: TypeStates = {
  brandInfo: null,
  projectData: null,
  selectedModule: null,
  selectedPage: null
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
      // 默认选择第一个模块和第一个页面
      const firstModule = action.payload?.template.modules[0];
      const firstPage = firstModule?.groups[0].pages[0];
      return updateState(state, {
        projectData: action.payload,
        selectedModule: firstModule,
        selectedPage: firstPage
      });
    }
    case ACTION_TYPES.SET_SELECTED_MODULE: {
      return updateState(state, { selectedModule: action.payload });
    }
    case ACTION_TYPES.SET_SELECTED_PAGE: {
      return updateState(state, { selectedPage: action.payload });
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
