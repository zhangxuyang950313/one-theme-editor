import { updateState } from "@/store/utils";
import {
  TypeProjectDataDoc,
  TypeProjectInfo,
  TypeProjectFileData
} from "src/types/project";
import {
  TypeSourceTypeConf,
  TypeSourceModuleConf,
  TypeSourcePageConf,
  TypeSourcePageData,
  TypeSourceConfig
} from "src/types/source";
import SourceConfig, {
  SourceModuleConf,
  SourcePageConf
} from "src/data/SourceConfig";
import ProjectData, { ProjectInfo } from "src/data/ProjectData";
import { ACTION_TYPES, TypeEditorActions } from "./action";

// main states
export type TypeEditorState = {
  projectData: TypeProjectDataDoc;
  projectInfo: TypeProjectInfo;
  uuid: string;
  projectRoot: string;
  sourceConfigPath: string;
  sourceConfig: TypeSourceConfig;
  sourceTypeList: TypeSourceTypeConf[];
  sourceModuleList: TypeSourceModuleConf[];
  sourceModuleSelected: TypeSourceModuleConf;
  sourcePageSelected: TypeSourcePageConf;
  sourcePageDataMap: Record<string, TypeSourcePageData>;
  projectFileDataMap: Record<string, TypeProjectFileData>;
};

const defaultState: TypeEditorState = {
  projectData: ProjectData.default,
  projectInfo: ProjectInfo.default,
  uuid: "",
  projectRoot: "",
  sourceConfigPath: "",
  sourceConfig: SourceConfig.default,
  sourceTypeList: [],
  sourceModuleList: [],
  sourceModuleSelected: SourceModuleConf.default,
  sourcePageSelected: SourcePageConf.default,
  sourcePageDataMap: {},
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
      document.title = action.payload.projectInfo.name || document.title;
      return updateState(state, {
        uuid: action.payload.uuid,
        projectRoot: action.payload.projectRoot,
        sourceConfigPath: action.payload.sourceConfigPath,
        projectInfo: action.payload.projectInfo,
        projectData: action.payload
      });
    }
    // 配置数据
    case ACTION_TYPES.SET_SOURCE_CONFIG: {
      const { sourceModuleList } = action.payload;
      return updateState(state, {
        sourceConfig: action.payload,
        sourceTypeList: action.payload.sourceTypeList,
        sourceModuleList: sourceModuleList,
        sourceModuleSelected: sourceModuleList[0],
        sourcePageSelected: sourceModuleList[0]?.groupList?.[0].pageList?.[0]
      });
    }
    // 模块配置
    case ACTION_TYPES.SET_MODULE_CONFIG: {
      return updateState(state, {
        sourceModuleSelected: action.payload
      });
    }
    // 页面配置
    case ACTION_TYPES.SET_PAGE_CONFIG: {
      return updateState(state, {
        sourcePageSelected: action.payload
      });
    }
    // 页面数据
    case ACTION_TYPES.PATCH_PAGE_DATA: {
      return updateState(state, {
        sourcePageDataMap: {
          ...state.sourcePageDataMap,
          [action.payload.config]: action.payload
        }
      });
    }
    case ACTION_TYPES.PATCH_PROJECT_SOURCE_DATA: {
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
