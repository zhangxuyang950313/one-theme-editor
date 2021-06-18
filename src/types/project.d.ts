import { projectInfoConfig } from "renderer/config/editor";
import { TypeTemplateInfo } from "./template";

export type TypeBrandInfo = {
  type: string;
  name: string;
};

export type TypeBrandConf = TypeBrandInfo & {
  templateDir: string;
};

// 工程描述信息
export type TypeProjectDescription = {
  [k in keyof typeof projectInfoConfig]: string;
};

export type TypeUiVersionInfo = {
  name: string;
  code: string;
};

// 预览页面配置储存数据
export type TypePageConf = {
  key: string;
  md5?: string;
  conf: TypeTempPageConf | null;
};

export type TypeCreateProjectData = {
  description: TypeProjectDesc;
  uiVersionConf: TypeUiVersionConf;
  brandConf: TypeBrandConf;
  templateConf: TypeTemplateConf;
};

// 图片存储数据
export type TypeImageData = {
  md5: string;
  base64: string | null;
};

// 用于前端展示的图片数据
export type TypeImageFrom = {
  url: string;
  md5: string;
  width: number;
  height: number;
  size: number;
  filename: string;
};

export type TypeImageMapper = TypeImageFrom & {
  target: string;
};

export type TypeXmlMapper = {
  content: string;
  target: string;
};

// 打包所有信息
export type TypeProjectData = {
  uuid: string;
  brand: TypeBrandInfo;
  description: TypeProjectDescription;
  uiVersion: TypeUiVersionInfo;
  template: TypeTemplateInfo;
  imageMapperList: TypeImageMapper[];
  xmlMapperList: TypeXmlMapper[];
};

// 从数据库取出的项目文档数据
export type TypeDatabase<T = { [x: string]: any }> = T & {
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
};

// 在数据库中的图片数据
export type TypeImageDataInDoc = TypeDatabase<TypeImageData>;

// 在数据库中的工程信息
export type TypeProjectDataInDoc = TypeDatabase<TypeProjectData>;

// 在 redux 缓存中的工程信息
export type TypeProjectStateInStore = Partial<TypeProjectDataInDoc>;
