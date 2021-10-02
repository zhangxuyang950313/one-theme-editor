import { updateState } from "@/store/utils";
import { TypeProjectDataDoc, TypeFileData } from "src/types/project";
import {
  TypeResModule,
  TypeResPageOption,
  TypeResPageConfig,
  TypeResourceConfig,
  TypeScenarioConfig
} from "src/types/resource";
import ResourceConfigData, {
  ResModuleConfig,
  ResPageOption
} from "src/data/ResourceConfig";
import ProjectData from "src/data/ProjectData";
import ScenarioConfigData from "src/data/ScenarioConfig";
import { ACTION_TYPES, TypeEditorActions } from "./action";

// main states
export type TypeEditorState = {
  projectData: TypeProjectDataDoc;
  scenarioConfig: TypeScenarioConfig;
  resourceConfig: TypeResourceConfig;
  currentModule: TypeResModule;
  currentPage: TypeResPageOption;
  pageConfigMap: Record<string, TypeResPageConfig>;
  fileDataMap: Record<string, TypeFileData>;
};

const defaultState: TypeEditorState = {
  projectData: ProjectData.default,
  scenarioConfig: ScenarioConfigData.default,
  resourceConfig: ResourceConfigData.default,
  currentModule: ResModuleConfig.default,
  currentPage: ResPageOption.default,
  pageConfigMap: {},
  fileDataMap: {}
};

const editorState: TypeEditorState = {
  ...defaultState
};

export default function EditorReducer(
  state: TypeEditorState = editorState,
  action: TypeEditorActions
): TypeEditorState {
  switch (action.type) {
    // 初始化数据
    case ACTION_TYPES.INIT_EDITOR: {
      return { ...defaultState };
    }
    // 工程数据
    case ACTION_TYPES.SET_PROJECT_DATA: {
      document.title = action.payload.description.name || document.title;
      return updateState(state, {
        projectData: action.payload
      });
    }
    // 场景数据
    case ACTION_TYPES.SET_SCENARIO_CONFIG: {
      return updateState(state, {
        scenarioConfig: action.payload
      });
    }
    // 配置数据
    case ACTION_TYPES.SET_RESOURCE_CONFIG: {
      const { moduleList: resourceModuleList } = action.payload;
      return updateState(state, {
        resourceConfig: action.payload,
        currentModule: resourceModuleList[0],
        currentPage: resourceModuleList[0]?.pageGroupList?.[0].pageList?.[0]
      });
    }
    // 模块配置
    case ACTION_TYPES.SET_MODULE_CONFIG: {
      return updateState(state, {
        currentModule: action.payload
      });
    }
    // 页面配置
    case ACTION_TYPES.SET_PAGE_OPTION: {
      return updateState(state, {
        currentPage: action.payload
      });
    }
    // 页面数据
    case ACTION_TYPES.PATCH_PAGE_CONFIG: {
      return updateState(state, {
        pageConfigMap: {
          ...state.pageConfigMap,
          [action.payload.config]: action.payload
        }
      });
    }
    case ACTION_TYPES.PATCH_PROJECT_RESOURCE: {
      return updateState(state, {
        fileDataMap: {
          ...state.fileDataMap,
          [action.payload.src]: action.payload
        }
      });
    }
    default:
      return state;
  }
}
