import ACTION_TYPES from "@/store/actions";

import {
  TypeDatabase,
  TypeProjectData,
  TypeImageMapper
} from "types/project.d";

type TypeActionInitProject = {
  type: typeof ACTION_TYPES.INIT_PROJECT;
};

type TypeActionSetProject = {
  type: typeof ACTION_TYPES.SET_PROJECT;
  payload: TypeDatabase<TypeProjectData>;
};

type TypeActionUpdateProject = {
  type: typeof ACTION_TYPES.UPDATE_PROJECT;
};

type TypeActionAddImageMapper = {
  type: typeof ACTION_TYPES.ADD_IMAGE_MAPPER;
  payload: TypeImageMapper;
};

type TypeActionDelImageMapper = {
  type: typeof ACTION_TYPES.DEL_IMAGE_MAPPER;
  payload: TypeImageMapper;
};

export type TypeActions =
  | TypeActionInitProject
  | TypeActionSetProject
  | TypeActionUpdateProject
  | TypeActionAddImageMapper
  | TypeActionDelImageMapper;

// 初始化工程信息
export function actionInitProject(): TypeActionInitProject {
  return { type: ACTION_TYPES.INIT_PROJECT };
}

// 设置工程数据
export function actionSetProject(
  projectData: TypeDatabase<TypeProjectData>
): TypeActionSetProject {
  return { type: ACTION_TYPES.SET_PROJECT, payload: projectData };
}

// 更新工程数据到数据库
export function actionUpdateProject(): TypeActionUpdateProject {
  return { type: ACTION_TYPES.UPDATE_PROJECT };
}

export function actionAddProjectImage(
  payload: TypeImageMapper
): TypeActionAddImageMapper {
  return { type: ACTION_TYPES.ADD_IMAGE_MAPPER, payload };
}

export function actionDelProjectImage(
  payload: TypeImageMapper
): TypeActionDelImageMapper {
  return { type: ACTION_TYPES.DEL_IMAGE_MAPPER, payload };
}
