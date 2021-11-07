import { TypePackConfig } from "./scenario.config";
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

// 图片数据
export type TypeImageData = {
  // md5: string;
  width: number;
  height: number;
  size: number;
  filename: string;
  ninePatch: boolean;
};

// 图片映射信息
export type TypeImageMapper = TypeImageData & {
  target: string;
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

// 在数据库中的图片数据
export type TypeImageDataDoc = TypeDatabase<TypeImageData>;

// 在数据库中的工程信息
export type TypeProjectDataDoc = TypeDatabase<TypeProjectData>;

// 打包过程返回信息
export type TypePackProcess = {
  msg: string;
  data: any;
};

export type TypePackPayload = {
  packConfig: TypePackConfig;
  packDir: string;
  outputFile: string;
};

export type TypeUnpackPayload = {
  packConfig: TypePackConfig;
  unpackFile: string;
  outputDir: string;
};
