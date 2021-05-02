import { projectInfoConfig } from "renderer/config/editor";
import { TypeTempFrom, TypeTempLayout, TypeTempTo } from "./xml-result";

// 品牌信息
export type TypeBrandInfo = {
  type: string;
  templateDir: string;
  name: string;
};

// 项目描述信息
export type TypeProjectInfo = {
  [k in keyof typeof projectInfoConfig]: string;
};

// -----------------------
// 模板配置原始数据
// 模板支持 ui 版本
export type TypeUiVersionConf = {
  name: string;
  src: string;
  code: string;
};
// 模板预览分类
export type TypeTempPreviewClassConf = {
  name: string;
  pages: string[]; // 页面配置路径
};
// 模板模块配置
export type TypeTempModuleConf = {
  name: string; // 模块名称
  icon: string; // 模块图标，用于侧边栏显示
  // 预览图类型
  previewClass: TypeTempPreviewClassConf[];
};
// 模板配置信息汇总
export type TypeTemplateConf = TypePreviewConf & {
  root: string;
};

// 预览数据配置
// 此时所有素材路径都已使用 key 来代替
export type TypePreviewConf = {
  key: string; // 随机键值
  name: string; // 模板名称
  cover: string; // 模板缩略图
  version: string; //
  uiVersions: TypeUiVersionConf[]; // 系统 UI 版本
  modules: TypeTempModuleConf[];
};

// 预览图配置
export type TypeTempPageConf = {
  root: string;
  config: { version: string; description: string; screenWidth: string };
  cover: string;
  category: {
    tag: string;
    description: string;
    type: "image" | "xml" | null;
  }[];
  source: {
    description: string;
    layout: TypeTempLayout;
    from: TypeTempFrom["src"];
    to: TypeTempTo["src"][];
  }[];
  xml: any[];
};

// 储存在数据库的项目数据
export type TypeProjectData = {
  uiVersion: TypeUiVersionConf;
  brandInfo: TypeBrandInfo;
  projectInfo: TypeProjectInfo;
  templateConf: TypeTemplateConf;
  previewConf: TypePreviewConf;
  pageConfData: TypePageConf[];
  imageData: TypeImageData[];
};

// 从数据库取出的项目文档数据
export type TypeDatabase<T = { [x: string]: any }> = T & {
  _id: string;
  createAt?: Date;
  updateAt?: Date;
};

// 图片存储数据
export type TypeImageData = {
  key: string;
  md5?: string;
  base64: string | null;
};

// 预览页面配置储存数据
export type TypePageConf = {
  key: string;
  md5?: string;
  conf: TypeTempPageConf | null;
};

// 项目数据
export type TypeProjectThm = {
  projectInfo: TypeProjectInfo;
  templateInfo: TypeTemplateConf;
  resource: TypeImageData;
};
