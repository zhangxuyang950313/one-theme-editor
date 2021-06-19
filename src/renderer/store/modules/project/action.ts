import ACTION_TYPES from "@/store/actions";

import { TypeDatabase } from "types/index";
import { TypeProjectData, TypeImageMapper } from "types/project";

type TypeActionInitProject = {
  type: typeof ACTION_TYPES.INIT_PROJECT;
};

type TypeActionSetProjectData = {
  type: typeof ACTION_TYPES.SET_PROJECT_DATA;
  payload: TypeDatabase<TypeProjectData>;
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
  | TypeActionSetProjectData
  | TypeActionAddImageMapper
  | TypeActionDelImageMapper;

// 初始化工程信息
export function ActionInitProject(): TypeActionInitProject {
  return { type: ACTION_TYPES.INIT_PROJECT };
}

// 设置工程数据
export function ActionSetProjectData(
  projectData: TypeDatabase<TypeProjectData>
): TypeActionSetProjectData {
  return { type: ACTION_TYPES.SET_PROJECT_DATA, payload: projectData };
}

export function ActionAddProjectImage(
  payload: TypeImageMapper
): TypeActionAddImageMapper {
  return { type: ACTION_TYPES.ADD_IMAGE_MAPPER, payload };
}

export function ActionDelProjectImage(
  payload: TypeImageMapper
): TypeActionDelImageMapper {
  return { type: ACTION_TYPES.DEL_IMAGE_MAPPER, payload };
}
