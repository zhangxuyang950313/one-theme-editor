import { updateState } from "@/store/utils";
import { TypeProjectDataDoc, TypeProjectInfo } from "types/project";
import {
  TypeSourceTypeConf,
  TypeSourceModuleConf,
  TypeSourcePageConf,
  TypeSourcePageData,
  TypeSourceConfigData
} from "types/source-config";
import {
  SourceConfigData,
  SourceModuleConf,
  SourcePageConf
} from "data/SourceConfig";
import { ProjectData, ProjectInfo } from "data/ProjectData";
import { ACTION_TYPES, TypeEditorActions } from "./action";

// main states
export type TypeEditorState = {
  projectData: TypeProjectDataDoc;
  projectInfo: TypeProjectInfo;
  uuid: string;
  projectPathname: string;
  sourceConfigUrl: string;
  sourceConfig: TypeSourceConfigData;
  sourceTypeList: TypeSourceTypeConf[];
  sourceModuleList: TypeSourceModuleConf[];
  // sourceElementList: TypeSourceElement[];
  sourceModuleConf: TypeSourceModuleConf;
  sourcePageConf: TypeSourcePageConf;
  // sourcePageData: TypeSourcePageData | null;
  sourcePageDataMap: Record<string, TypeSourcePageData>;
};

const editorState: TypeEditorState = {
  projectData: ProjectData.default(),
  projectInfo: ProjectInfo.default(),
  uuid: "",
  projectPathname: "",
  sourceConfigUrl: "",
  sourceConfig: SourceConfigData.default(),
  sourceTypeList: [],
  sourceModuleList: [],
  // sourceElementList: [],
  sourceModuleConf: SourceModuleConf.default(),
  sourcePageConf: SourcePageConf.default(),
  // sourcePageData: null,
  sourcePageDataMap: {}
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
        projectPathname: action.payload.projectPathname,
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
    case ACTION_TYPES.UPDATE_PAGE_DATA: {
      return updateState(state, {
        sourcePageDataMap: {
          ...state.sourcePageDataMap,
          [action.payload.config]: action.payload
        }
      });
    }
    default:
      return state;
  }
}
