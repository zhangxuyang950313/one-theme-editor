import { updateState } from "@/store/utils";
import { TypeProjectDataDoc, TypeProjectFileData } from "src/types/project";
import {
  TypeResourceModuleConf,
  TypeResourcePageOption,
  TypeResourcePageConf,
  TypeResourceConfig,
  TypeScenarioConfig
} from "src/types/resource";
import ResourceConfigData, {
  ResourceModuleConf,
  ResourcePageOption
} from "src/data/ResourceConfig";
import ProjectData from "src/data/ProjectData";
import ScenarioConfigData from "src/data/ScenarioConfig";
import { ACTION_TYPES, TypeEditorActions } from "./action";

// main states
export type TypeEditorState = {
  projectData: TypeProjectDataDoc;
  scenarioConfig: TypeScenarioConfig;
  resourceConfig: TypeResourceConfig;
  currentModuleConfig: TypeResourceModuleConf;
  currentPageOption: TypeResourcePageOption;
  pageConfigMap: Record<string, TypeResourcePageConf>;
  projectFileDataMap: Record<string, TypeProjectFileData>;
};

const defaultState: TypeEditorState = {
  projectData: ProjectData.default,
  scenarioConfig: ScenarioConfigData.default,
  resourceConfig: ResourceConfigData.default,
  currentModuleConfig: ResourceModuleConf.default,
  currentPageOption: ResourcePageOption.default,
  pageConfigMap: {},
  projectFileDataMap: {}
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
      const { resourceModuleList } = action.payload;
      return updateState(state, {
        resourceConfig: action.payload,
        currentModuleConfig: resourceModuleList[0],
        currentPageOption: resourceModuleList[0]?.groupList?.[0].pageList?.[0]
      });
    }
    // 模块配置
    case ACTION_TYPES.SET_MODULE_CONFIG: {
      return updateState(state, {
        currentModuleConfig: action.payload
      });
    }
    // 页面配置
    case ACTION_TYPES.SET_PAGE_OPTION: {
      return updateState(state, {
        currentPageOption: action.payload
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
        projectFileDataMap: {
          ...state.projectFileDataMap,
          [action.payload.src]: action.payload
        }
      });
    }
    default:
      return state;
  }
}
