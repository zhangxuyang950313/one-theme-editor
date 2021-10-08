import path from "path";
import { updateState } from "@/store/utils";
import { TypeProjectDataDoc, TypeFileData } from "src/types/project";
import {
  TypeResModuleConfig,
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
import electronStore from "src/common/electronStore";
import pathUtil from "server/utils/pathUtil";
import { ACTION_TYPE, TypeEditorActions } from "./action";

// main states
export type TypeEditorState = {
  projectData: TypeProjectDataDoc;
  scenarioConfig: TypeScenarioConfig;
  resourceConfig: TypeResourceConfig;
  currentModule: TypeResModuleConfig;
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
    case ACTION_TYPE.INIT_EDITOR: {
      return { ...defaultState };
    }
    // 工程数据
    case ACTION_TYPE.SET_PROJECT_DATA: {
      document.title = action.payload.description.name || document.title;
      electronStore.set("projectData", action.payload);
      electronStore.set("projectPath", action.payload.root);
      return updateState(state, {
        projectData: action.payload
      });
    }
    // 场景数据
    case ACTION_TYPE.SET_SCENARIO_CONFIG: {
      electronStore.set("scenarioConfig", action.payload);
      return updateState(state, {
        scenarioConfig: action.payload
      });
    }
    // 配置数据
    case ACTION_TYPE.SET_RESOURCE_CONFIG: {
      const { moduleList } = action.payload;
      electronStore.set("resourceConfig", action.payload);
      const resourcePath = path.join(
        pathUtil.RESOURCE_CONFIG_DIR,
        action.payload.namespace
      );
      electronStore.set("resourcePath", resourcePath);
      return updateState(state, {
        resourceConfig: action.payload,
        currentModule: moduleList[0],
        currentPage: moduleList[0]?.pageList?.[0]
      });
    }
    // 模块配置
    case ACTION_TYPE.SET_MODULE_CONFIG: {
      return updateState(state, {
        currentModule: action.payload
      });
    }
    // 页面配置
    case ACTION_TYPE.SET_PAGE_OPTION: {
      return updateState(state, {
        currentPage: action.payload
      });
    }
    // 页面数据
    case ACTION_TYPE.PATCH_PAGE_CONFIG: {
      return updateState(state, {
        pageConfigMap: {
          ...state.pageConfigMap,
          [action.payload.config]: action.payload
        }
      });
    }
    case ACTION_TYPE.PATCH_FILE_DATA_MAP: {
      return updateState(state, {
        fileDataMap: {
          ...state.fileDataMap,
          [action.payload.src]: action.payload
        }
      });
    }
    case ACTION_TYPE.REMOVE_FILE_DATA_MAP: {
      delete state.fileDataMap[action.payload];
      return updateState(state, {
        fileDataMap: { ...state.fileDataMap }
      });
    }
    default:
      return state;
  }
}
