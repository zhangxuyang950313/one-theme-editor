import {
  TypeSourceTypeConf,
  TypeSourceElement,
  TypeSourceConfig,
  TypeSourceModuleConf,
  TypeSourcePageGroupConf,
  TypeSourcePageConf,
  TypeSourcePageData
} from "types/source-config";
import { TypeProjectDataDoc, TypeProjectInfo } from "types/project";
import ACTION_TYPES from "@/store/actions";
import { updateState } from "@/store/utils";
import { TypeEditorActions } from "./action";

// main states
export type TypeEditorState = {
  projectData: TypeProjectDataDoc | null;
  projectInfo: TypeProjectInfo | null;
  uuid: string | null;
  projectRoot: string | null;
  sourceConfigFile: string | null;
  sourceConfig: TypeSourceConfig | null;
  sourceTypeList: TypeSourceTypeConf[];
  sourceModuleList: TypeSourceModuleConf[];
  sourceElementList: TypeSourceElement[];
  currentModule: TypeSourceModuleConf | null;
  currentPageGroupList: TypeSourcePageGroupConf[];
  currentPage: TypeSourcePageConf | null;
  currentPageData: TypeSourcePageData | null;
};

const editorState: TypeEditorState = {
  projectData: null,
  projectInfo: null,
  uuid: null,
  projectRoot: null,
  sourceConfigFile: null,
  sourceConfig: null,
  sourceTypeList: [],
  sourceModuleList: [],
  sourceElementList: [],
  currentModule: null,
  currentPageGroupList: [],
  currentPage: null,
  currentPageData: null
};

export default function EditorReducer(
  state: TypeEditorState = editorState,
  action: TypeEditorActions
): TypeEditorState {
  switch (action.type) {
    case ACTION_TYPES.SET_SOURCE_CONFIG: {
      const moduleList = action.payload.moduleList;
      return updateState(state, {
        sourceConfig: action.payload,
        sourceTypeList: action.payload.sourceTypeList,
        sourceModuleList: moduleList,
        currentModule: moduleList[0] || null,
        currentPageGroupList: moduleList[0]?.groupList || [],
        currentPage: moduleList[0]?.groupList?.[0].pageList?.[0] || null
      });
    }
    case ACTION_TYPES.SET_CURRENT_MODULE: {
      return updateState(state, {
        currentModule: action.payload
      });
    }
    case ACTION_TYPES.SET_CURRENT_PAGE: {
      return updateState(state, {
        currentPage: action.payload
      });
    }
    case ACTION_TYPES.SET_PROJECT_DATA: {
      return updateState(state, {
        uuid: action.payload.uuid,
        projectRoot: action.payload.projectRoot,
        sourceConfigFile: action.payload.sourceConfigFile,
        projectInfo: action.payload.projectInfo,
        projectData: action.payload
      });
    }
    default:
      return state;
  }
}
