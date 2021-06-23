import ACTION_TYPES from "@/store/actions";

import {
  TypeProjectDataDoc,
  TypeImageMapper,
  TypeProjectDescription
} from "types/project";

type TypeActionInitProject = {
  type: typeof ACTION_TYPES.INIT_PROJECT;
};

type TypeActionSetProjectData = {
  type: typeof ACTION_TYPES.SET_PROJECT_DATA;
  payload: TypeProjectDataDoc;
};

type TypeActionSetProjectDescription = {
  type: typeof ACTION_TYPES.SET_PROJECT_DESCRIPTION;
  payload: TypeProjectDescription;
};

type TypeActionSetImageMapperList = {
  type: typeof ACTION_TYPES.SET_IMAGE_MAPPER_LIST;
  payload: TypeImageMapper[];
};

export type TypeActions =
  | TypeActionInitProject
  | TypeActionSetProjectData
  | TypeActionSetProjectDescription
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
  payload: TypeProjectDescription
): TypeActionSetProjectDescription {
  return { type: ACTION_TYPES.SET_PROJECT_DESCRIPTION, payload };
}

// 设置 imageMapperList
export function ActionSetImageMapperList(
  payload: TypeImageMapper[]
): TypeActionSetImageMapperList {
  return { type: ACTION_TYPES.SET_IMAGE_MAPPER_LIST, payload };
}
