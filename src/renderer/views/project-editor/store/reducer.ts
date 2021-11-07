import { TypeProjectDataDoc } from "src/types/project";
import {
  TypeModuleConfig,
  TypePageOption,
  TypePageConfig,
  TypeResourceConfig
} from "src/types/resource.config";
import { TypeScenarioConfig } from "src/types/scenario.config";
import ResourceConfigData, {
  ModuleConfig,
  PageOption
} from "src/data/ResourceConfig";
import ProjectData from "src/data/ProjectData";
import ScenarioConfig from "src/data/ScenarioConfig";
import { TypeFileData } from "src/types/resource.page";
import { ACTION_TYPE, TypeEditorActions } from "./action";
import { updateState } from "@/store/utils";

// main states
export type TypeEditorState = {
  projectData: TypeProjectDataDoc;
  scenarioConfig: TypeScenarioConfig;
  resourceConfig: TypeResourceConfig;
  currentModule: TypeModuleConfig;
  currentPage: TypePageOption;
  pageConfigMap: Record<string, TypePageConfig | undefined>;
  fileDataMap: Record<string, TypeFileData | undefined>;
};

const defaultState: TypeEditorState = {
  projectData: ProjectData.default,
  scenarioConfig: ScenarioConfig.default,
  resourceConfig: ResourceConfigData.default,
  currentModule: ModuleConfig.default,
  currentPage: PageOption.default,
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
    case ACTION_TYPE.INIT_EDITOR: {
      return { ...defaultState };
    }
    // 工程数据
    case ACTION_TYPE.SET_PROJECT_DATA: {
      document.title = action.payload.description.name || document.title;
      return updateState(state, {
        projectData: action.payload
      });
    }
    // 场景数据
    case ACTION_TYPE.SET_SCENARIO_CONFIG: {
      return updateState(state, {
        scenarioConfig: action.payload
      });
    }
    // 配置数据
    case ACTION_TYPE.SET_RESOURCE_CONFIG: {
      const { moduleList } = action.payload;
      return updateState(state, {
        resourceConfig: action.payload || defaultState.resourceConfig,
        currentModule: moduleList[0] || defaultState.currentModule,
        currentPage: moduleList[0]?.pageList?.[0] || defaultState.currentPage
      });
    }
    // 模块配置
    case ACTION_TYPE.SET_MODULE_CONFIG: {
      return updateState(state, {
        currentModule: action.payload || defaultState.currentModule,
        currentPage: action.payload.pageList[0] || defaultState.currentPage
      });
    }
    // 页面配置
    case ACTION_TYPE.SET_PAGE_OPTION: {
      return updateState(state, {
        currentPage: action.payload || defaultState.currentPage
      });
    }
    // 页面配置数据
    case ACTION_TYPE.PATCH_PAGE_CONFIG: {
      return updateState(state, {
        pageConfigMap: {
          ...state.pageConfigMap,
          [action.payload.config]: action.payload
        }
      });
    }
    // xml 文件数据
    case ACTION_TYPE.PATCH_FILE_DATA: {
      const { src, fileData } = action.payload;
      if (fileData === null) {
        delete state.fileDataMap[src];
        return updateState(state, {
          fileDataMap: { ...state.fileDataMap }
        });
      }
      return updateState(state, {
        fileDataMap: {
          ...state.fileDataMap,
          [src]: fileData
        }
      });
    }
    default:
      return state;
  }
}
