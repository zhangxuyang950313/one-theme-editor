import { updateState } from "@/store/utils";
import {
  TypeProjectDataDoc,
  TypeProjectInfo,
  TypeProjectFileData
} from "src/types/project";
import {
  TypeResourceTypeConf,
  TypeResourceModuleConf,
  TypeResourcePageOption,
  TypeResourcePageConf,
  TypeResourceConfig
} from "src/types/resource";
import ResourceConfig, {
  ResourceModuleConf,
  ResourcePageOption
} from "src/data/ResourceConfig";
import ProjectData, { ProjectInfo } from "src/data/ProjectData";
import { ACTION_TYPES, TypeEditorActions } from "./action";

// main states
export type TypeEditorState = {
  projectData: TypeProjectDataDoc;
  projectInfo: TypeProjectInfo;
  uuid: string;
  projectRoot: string;
  resourceConfigPath: string;
  resourceConfig: TypeResourceConfig;
  resourceTypeList: TypeResourceTypeConf[];
  resourceModuleList: TypeResourceModuleConf[];
  resourceModuleSelected: TypeResourceModuleConf;
  resourcePageSelected: TypeResourcePageOption;
  resourcePageConfigMap: Record<string, TypeResourcePageConf>;
  projectFileDataMap: Record<string, TypeProjectFileData>;
};

const defaultState: TypeEditorState = {
  projectData: ProjectData.default,
  projectInfo: ProjectInfo.default,
  uuid: "",
  projectRoot: "",
  resourceConfigPath: "",
  resourceConfig: ResourceConfig.default,
  resourceTypeList: [],
  resourceModuleList: [],
  resourceModuleSelected: ResourceModuleConf.default,
  resourcePageSelected: ResourcePageOption.default,
  resourcePageConfigMap: {},
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
        resourceConfigPath: action.payload.resourceConfigPath,
        projectInfo: action.payload.projectInfo,
        projectData: action.payload
      });
    }
    // 配置数据
    case ACTION_TYPES.SET_RESOURCE_CONFIG: {
      const { resourceModuleList } = action.payload;
      return updateState(state, {
        resourceConfig: action.payload,
        resourceTypeList: action.payload.resourceTypeList,
        resourceModuleList: resourceModuleList,
        resourceModuleSelected: resourceModuleList[0],
        resourcePageSelected:
          resourceModuleList[0]?.groupList?.[0].pageList?.[0]
      });
    }
    // 模块配置
    case ACTION_TYPES.SET_MODULE_CONFIG: {
      return updateState(state, {
        resourceModuleSelected: action.payload
      });
    }
    // 页面配置
    case ACTION_TYPES.SET_PAGE_CONFIG: {
      return updateState(state, {
        resourcePageSelected: action.payload
      });
    }
    // 页面数据
    case ACTION_TYPES.PATCH_PAGE_CONFIG: {
      return updateState(state, {
        resourcePageConfigMap: {
          ...state.resourcePageConfigMap,
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
