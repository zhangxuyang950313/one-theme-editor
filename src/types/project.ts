import { Element } from "xml-js";
import { PROJECT_FILE_TYPE } from "../enum";
import { TypeBrandConf } from "./source";
import { TypeDatabase } from "./index";

// 版本信息
export type TypeProjectUiVersion = {
  name: string;
  code: string;
};

// 工程描述信息
export type TypeProjectInfo = {
  // [k in keyof typeof projectInfoConfig]: string | null;
  [k: string]: string;
};

// 创建工程载荷
export type TypeCreateProjectPayload = {
  projectRoot: string;
  sourceConfigPath: string;
  brandConfig: TypeBrandConf;
  projectInfo: TypeProjectInfo;
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
export type TypeProjectData = {
  uuid: string;
  brandConfig: TypeBrandConf;
  projectRoot: string;
  projectInfo: TypeProjectInfo;
  uiVersion: TypeProjectUiVersion;
  sourceConfigPath: string;
};

// 在数据库中的图片数据
export type TypeImageDataDoc = TypeDatabase<TypeImageData>;

// 在数据库中的工程信息
export type TypeProjectDataDoc = TypeDatabase<TypeProjectData>;

export type TypeProjectImageFileData = {
  readonly type: PROJECT_FILE_TYPE.IMAGE;
  src: string;
  url: string;
  imageData: TypeImageData;
};

export type TypeProjectXmlFileData = {
  readonly type: PROJECT_FILE_TYPE.XML;
  src: string;
  element: Element;
};

export type TypeProjectFileData =
  | TypeProjectImageFileData
  | TypeProjectXmlFileData;
