import { projectInfoConfig } from "renderer/config/editor";
import { TypeTemplateInfo } from "./template.d";

export type TypeBrandInfo = {
  type: string;
  name: string;
};

export type TypeBrandConf = TypeBrandInfo & {
  templateDir: string;
};

export type TypeProjectInfo = {
  [k in keyof typeof projectInfoConfig]: string;
};

export type TypeUiVersionInfo = {
  name: string;
  code: string;
};

// 从数据库取出的项目文档数据
export type TypeDatabase<T = { [x: string]: any }> = T & {
  _id: string;
  createAt?: Date;
  updateAt?: Date;
};

// 图片存储数据
export type TypeImageData = {
  md5: string;
  base64: string | null;
};

// 用于前端展示的图片数据
export type TypeImageDataVO = {
  url: string;
  width: number;
  height: number;
  size: number;
  filename: string;
};

export type TypeImageDataInDoc = TypeDatabase<TypeImageData>;

// 预览页面配置储存数据
export type TypePageConf = {
  key: string;
  md5?: string;
  conf: TypeTempPageConf | null;
};

export type TypeCreateProjectData = {
  projectInfo: TypeProjectDesc;
  uiVersionConf: TypeUiVersionConf;
  brandConf: TypeBrandConf;
  templateConf: TypeTemplateConf;
};

// 打包所有信息
export type TypeProjectData = {
  uuid: string | null;
  brand: TypeBrandInfo | null;
  projectInfo: TypeProjectInfo | null;
  uiVersion: TypeUiVersionInfo | null;
  template: TypeTemplateInfo | null;
  imageDataList: TypeImageData[];
  imageMapperList: TypeImageMapper[];
};

export type TypeProjectDataInDoc = TypeDatabase<TypeProjectData>;

export type TypeImageMapper = {
  url: string;
  target: string;
  size: number;
};
export type TypeProjectXml = {
  content: string;
  target: string;
};
