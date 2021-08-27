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
  TypeSourceConfigData
} from "src/types/source";
import {
  SourceConfigData,
  SourceModuleConf,
  SourcePageConf
} from "src/data/SourceConfig";
import { ProjectData, ProjectInfo } from "src/data/ProjectData";
import { ACTION_TYPES, TypeEditorActions } from "./action";

// main states
export type TypeEditorState = {
  projectData: TypeProjectDataDoc;
  projectInfo: TypeProjectInfo;
  uuid: string;
  projectRoot: string;
  sourceConfigUrl: string;
  sourceConfig: TypeSourceConfigData;
  sourceTypeList: TypeSourceTypeConf[];
  sourceModuleList: TypeSourceModuleConf[];
  sourceModuleConf: TypeSourceModuleConf;
  sourcePageConf: TypeSourcePageConf;
  sourcePageDataMap: Record<string, TypeSourcePageData>;
  projectFileDataMap: Record<string, TypeProjectFileData>;
};

const editorState: TypeEditorState = {
  projectData: new ProjectData().default(),
  projectInfo: new ProjectInfo().default(),
  uuid: "",
  projectRoot: "",
  sourceConfigUrl: "",
  sourceConfig: new SourceConfigData().default(),
  sourceTypeList: [],
  sourceModuleList: [],
  sourceModuleConf: new SourceModuleConf().default(),
  sourcePageConf: new SourcePageConf().default(),
  sourcePageDataMap: {},
  projectFileDataMap: {}
};

export default function EditorReducer(
  state: TypeEditorState = editorState,
  action: TypeEditorActions
): TypeEditorState {
  switch (action.type) {
    // 工程数据
    case ACTION_TYPES.SET_PROJECT_DATA: {
      document.title = action.payload.projectInfo.name || document.title;
      return updateState(state, {
        uuid: action.payload.uuid,
        projectRoot: action.payload.projectRoot,
        sourceConfigUrl: action.payload.sourceConfigPath,
        projectInfo: action.payload.projectInfo,
        projectData: action.payload
      });
    }
    // 配置数据
    case ACTION_TYPES.SET_SOURCE_CONFIG: {
      const moduleList = action.payload.moduleList;
      return updateState(state, {
        sourceConfig: action.payload,
        sourceTypeList: action.payload.sourceTypeList,
        sourceModuleList: moduleList,
        sourceModuleConf: moduleList[0],
        sourcePageConf: moduleList[0]?.groupList?.[0].pageList?.[0]
      });
    }
    // 模块配置
    case ACTION_TYPES.SET_MODULE_CONFIG: {
      return updateState(state, {
        sourceModuleConf: action.payload
      });
    }
    // 页面配置
    case ACTION_TYPES.SET_PAGE_CONFIG: {
      return updateState(state, {
        sourcePageConf: action.payload
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
