import { Element } from "xml-js";
import { PROJECT_FILE_TYPE } from "../enum";
import { TypeDatabase } from "./index";

export type TypeBrandInfo = {
  type: string;
  name: string;
};

export type TypeBrandConf = TypeBrandInfo & {
  sourceConfigs: string[];
};

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
  projectPathname: string;
  sourceConfigPath: string;
  brandInfo: TypeBrandInfo;
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
  brandInfo: TypeBrandInfo;
  projectPathname: string;
  projectInfo: TypeProjectInfo;
  uiVersion: TypeProjectUiVersion;
  sourceConfigPath: string;
};

// 在数据库中的图片数据
export type TypeImageDataDoc = TypeDatabase<TypeImageData>;

// 在数据库中的工程信息
export type TypeProjectDataDoc = TypeDatabase<TypeProjectData>;

export type TypeProjectImageSourceData = {
  type: PROJECT_FILE_TYPE.IMAGE;
  path: string;
  sourceData: {
    src: string;
  };
};

export type TypeProjectXmlSourceData = {
  type: PROJECT_FILE_TYPE.XML;
  path: string;
  valueData: Element;
};

export type TypeProjectSourceData =
  | TypeProjectImageSourceData
  | TypeProjectXmlSourceData;
