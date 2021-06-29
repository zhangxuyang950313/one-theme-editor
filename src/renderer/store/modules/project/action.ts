import ACTION_TYPES from "@/store/actions";

import {
  TypeProjectDataDoc,
  TypeImageMapper,
  TypeProjectInfo
} from "types/project";

type TypeActionInitProject = {
  type: typeof ACTION_TYPES.INIT_PROJECT;
};

type TypeActionSetProjectData = {
  type: typeof ACTION_TYPES.SET_PROJECT_DATA;
  payload: TypeProjectDataDoc;
};

type TypeActionSetProjectInfo = {
  type: typeof ACTION_TYPES.SET_PROJECT_INFO;
  payload: TypeProjectInfo;
};

type TypeActionSetImageMapperList = {
  type: typeof ACTION_TYPES.SET_IMAGE_MAPPER_LIST;
  payload: TypeImageMapper[];
};

export type TypeActions =
  | TypeActionInitProject
  | TypeActionSetProjectData
  | TypeActionSetProjectInfo
  | TypeActionSetImageMapperList;

// 初始化工程信息
export function ActionInitProject(): TypeActionInitProject {
  return { type: ACTION_TYPES.INIT_PROJECT };
}

// 设置工程数据
export function ActionSetProjectData(
  projectData: TypeProjectDataDoc
): TypeActionSetProjectData {
  return { type: ACTION_TYPES.SET_PROJECT_DATA, payload: projectData };
}

// 设置 description
export function ActionSetDescription(
  payload: TypeProjectInfo
): TypeActionSetProjectInfo {
  return { type: ACTION_TYPES.SET_PROJECT_INFO, payload };
}

// 设置 imageMapperList
export function ActionSetImageMapperList(
  payload: TypeImageMapper[]
): TypeActionSetImageMapperList {
  return { type: ACTION_TYPES.SET_IMAGE_MAPPER_LIST, payload };
}
