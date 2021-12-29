import { TypeDatabase } from "./utils";

// 版本信息
export type TypeUiVersion = {
  name: string;
  code: string;
};

// 工程描述信息
export type TypeProjectInfo = {
  [k: string]: string;
};

// 创建工程载荷
export type TypeCreateProjectPayload = {
  root: string;
  description: TypeProjectInfo;
  scenarioSrc: string;
  resourceSrc: string;
};

export type TypeXmlMapper = {
  content: string;
  target: string;
};

// 打包所有信息
export type TypeProjectData = TypeCreateProjectPayload & {
  uuid: string;
  uiVersion: TypeUiVersion;
};

// 在数据库中的工程信息
export type TypeProjectDataDoc = TypeDatabase<TypeProjectData>;

// 打包过程返回信息
export type TypeProgressData<T = any> = {
  code: -1 | 0 | 1;
  msg: string;
  data: T;
};

export type TypeProgressFn = (x: TypeProgressData) => void;
