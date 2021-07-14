import {
  TypeSourceTypeConf,
  TypeSourceConfigData,
  TypeSourceModuleConf,
  TypeSourcePageConf,
  TypeSourcePageData
} from "types/source-config";
import { TypeProjectDataDoc, TypeProjectInfo } from "types/project";
import { updateState } from "@/store/utils";
import ProjectData from "src/data-model/ProjectData";
import ProjectInfo from "src/data-model/ProjectInfo";
import SourceConfig from "src/data-model/SourceConfig";
import { ACTION_TYPES, TypeEditorActions } from "./action";

// main states
export type TypeEditorState = {
  projectData: ProjectData;
  projectInfo: ProjectInfo;
  uuid: string;
  projectPathname: string;
  sourceConfigUrl: string;
  sourceConfig: SourceConfig;
  sourceTypeList: TypeSourceTypeConf[];
  sourceModuleList: TypeSourceModuleConf[];
  // sourceElementList: TypeSourceElement[];
  sourceModuleConf: TypeSourceModuleConf;
  sourcePageConf: TypeSourcePageConf;
  // sourcePageData: TypeSourcePageData | null;
  sourcePageDataMap: Record<string, TypeSourcePageData>;
};

const editorState: TypeEditorState = {
  projectData: new ProjectData(),
  projectInfo: new ProjectInfo(),
  uuid: "",
  projectPathname: "",
  sourceConfigUrl: "",
  sourceConfig: new SourceConfig(),
  sourceTypeList: [],
  sourceModuleList: [],
  // sourceElementList: [],
  sourceModuleConf: {},
  sourcePageConf: {},
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
        sourceConfigUrl: action.payload.sourceConfigUrl,
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
          [action.payload.url]: action.payload
        }
      });
    }
    default:
      return state;
  }
}
