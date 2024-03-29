import ResourceConfigData from "src/data/ResourceConfig";
import ProjectData from "src/data/ProjectData";
import ScenarioConfig from "src/data/ScenarioConfig";

import { ACTION_TYPE, TypeEditorActions } from "./action";

import type { TypeProjectDataDoc } from "src/types/project";
import type { TypePageConfig, TypeResourceConfig } from "src/types/config.resource";
import type { TypeScenarioConfig } from "src/types/config.scenario";
import type { TypeFileData } from "src/types/file-data";

import { updateState } from "@/store/utils";

// main states
export type TypeEditorState = {
  projectData: TypeProjectDataDoc;
  scenarioConfig: TypeScenarioConfig;
  resourceConfig: TypeResourceConfig;
  focusKeyPath: string;
  pageConfigMap: Record<string, TypePageConfig | undefined>;
  fileDataMap: Record<string, TypeFileData | undefined>;
};

const defaultState: TypeEditorState = {
  projectData: ProjectData.default,
  scenarioConfig: ScenarioConfig.default,
  resourceConfig: ResourceConfigData.default,
  focusKeyPath: "",
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
      return updateState(state, {
        resourceConfig: action.payload
      });
    }
    // 设置聚焦的 keyPath
    case ACTION_TYPE.SET_FOCUS_KEY_PATH: {
      const { keyPath, ignoreDuplicate } = action.payload;
      let focusKeyPath = keyPath;
      // 重复是否重置
      if (!ignoreDuplicate) {
        focusKeyPath = state.focusKeyPath === keyPath ? "" : keyPath;
      }
      return updateState(state, {
        focusKeyPath
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
