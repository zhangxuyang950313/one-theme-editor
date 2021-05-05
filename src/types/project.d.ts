import { projectInfoConfig } from "renderer/config/editor";
import { TypeTempFrom, TypeTempLayout, TypeTempTo } from "./xml-result";

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

export type TypeUiVersionConf = TypeUiVersionInfo & {
  src: string;
};

export type TypeTempClassConf = {
  name: string;
  pages: TypeTempPageConf[];
};

export type TypeTempModuleConf = {
  name: string;
  icon: string;
  classes: TypeTempClassConf[];
};

export type TypeTemplateConf = {
  key: string;
  root: string;
  file: string;
  name: string;
  cover: string;
  version: string;
  uiVersions: TypeUiVersionConf[];
};

export type TypeTemplateInfo = {
  name: string;
  cover: string;
  version: string;
  uiVersions: TypeUiVersionConf[];
  modules: TypeTempModuleConf[];
};

export type TypeTempPageConfigConf = {
  version: string;
  description: string;
  screenWidth: string;
};
export type TypeTempPageCategoryConf = {
  tag: string;
  description: string;
  type: "image" | "xml" | "";
};
export type TypeTempPageSourceConf = {
  description: string;
  layout: TypeTempLayout;
  from: TypeTempFrom["src"];
  to: TypeTempTo["src"][];
};
export type TypeTempPageConf = {
  config: TypeTempPageConfigConf;
  cover: string;
  category: TypeTempPageCategoryConf[];
  source: TypeTempPageSourceConf[];
  xml: any[];
};

// 从数据库取出的项目文档数据
export type TypeDatabase<T = { [x: string]: any }> = T & {
  _id: string;
  createAt?: Date;
  updateAt?: Date;
};

// 图片存储数据
export type TypeImageData = {
  md5?: string;
  base64: string | null;
};

export type TypeImageDataInDoc = TypeDatabase<TypeImageData>;

// 预览页面配置储存数据
export type TypePageConf = {
  key: string;
  md5?: string;
  conf: TypeTempPageConf | null;
};

export type TypeCreateProjectData = {
  projectInfo: TypeProjectInfo;
  uiVersionConf: TypeUiVersionConf;
  brandConf: TypeBrandConf;
  templateConf: TypeTemplateConf;
};

// 打包所有信息
export type TypeProjectData = {
  projectInfo: TypeProjectInfo;
  uiVersionInfo: TypeUiVersionInfo;
  brandInfo: TypeBrandInfo;
  templateInfo: TypeTemplateInfo;
};
