import {
  TypeSourceConfig,
  TypeSCModuleConf,
  TypeSCPageConf
} from "types/source-config";
import { TypeProjectDataDoc } from "types/project";
import ACTION_TYPES from "@/store/actions";
import { updateState } from "@/store/utils";
import { TypeEditorActions } from "./action";

// main states
export type TypeEditorState = {
  currentConfig: TypeSourceConfig | null;
  currentModule: TypeSCModuleConf | null;
  currentPage: TypeSCPageConf | null;
  projectData: TypeProjectDataDoc | null;
};

const editorState: TypeEditorState = {
  currentConfig: null,
  currentModule: null,
  currentPage: null,
  projectData: null
};

export default function EditorReducer(
  state: TypeEditorState = editorState,
  action: TypeEditorActions
): TypeEditorState {
  switch (action.type) {
    case ACTION_TYPES.SET_SOURCE_CONFIG: {
      return updateState(state, { currentConfig: action.payload });
    }
    case ACTION_TYPES.SET_SOURCE_CONFIG_MODULE: {
      return updateState(state, { currentModule: action.payload });
    }
    case ACTION_TYPES.SET_SOURCE_CONFIG_PAGE: {
      return updateState(state, { currentPage: action.payload });
    }
    case ACTION_TYPES.SET_PROJECT_DATA: {
      return updateState(state, { projectData: action.payload });
    }
    default:
      return state;
  }
}
