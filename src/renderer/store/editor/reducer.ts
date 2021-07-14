import {
  TypeSourceTypeConf,
  TypeSourceModuleConf,
  TypeSourcePageConf,
  TypeSourcePageData
} from "types/source-config";
import { updateState } from "@/store/utils";
import {
  DataProjectData,
  DataProjectInfo
} from "src/data-model/DataProjectData";
import {
  DataSourceConfig,
  DataSourceModuleConf,
  DataSourcePageConf
} from "src/data-model/DataSourceConfig";
import { ACTION_TYPES, TypeEditorActions } from "./action";

// main states
export type TypeEditorState = {
  projectData: DataProjectData;
  projectInfo: DataProjectInfo;
  uuid: string;
  projectPathname: string;
  sourceConfigUrl: string;
  sourceConfig: DataSourceConfig;
  sourceTypeList: TypeSourceTypeConf[];
  sourceModuleList: TypeSourceModuleConf[];
  // sourceElementList: TypeSourceElement[];
  sourceModuleConf: TypeSourceModuleConf;
  sourcePageConf: TypeSourcePageConf;
  // sourcePageData: TypeSourcePageData | null;
  sourcePageDataMap: Record<string, TypeSourcePageData>;
};

const editorState: TypeEditorState = {
  projectData: new DataProjectData(),
  projectInfo: new DataProjectInfo(),
  uuid: "",
  projectPathname: "",
  sourceConfigUrl: "",
  sourceConfig: new DataSourceConfig(),
  sourceTypeList: [],
  sourceModuleList: [],
  // sourceElementList: [],
  sourceModuleConf: new DataSourceModuleConf(),
  sourcePageConf: new DataSourcePageConf(),
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
