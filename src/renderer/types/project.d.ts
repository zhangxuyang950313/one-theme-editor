import { projectInfoConfig } from "@/config/editor";
import { TypeTempFrom, TypeTempLayout, TypeTempTo } from "./xml-result";

// 品牌信息
export type TypeBrandInfo = {
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
export type TypeTempUiVersionConf = {
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
export type TypeTemplateConf = {
  key: string; // 随机键值
  root: string;
  name: string; // 模板名称
  cover: string; // 模板缩略图
  version: string; //
  uiVersions: TypeTempUiVersionConf[] | []; // 系统 UI 版本
  modules: TypeTempModuleConf[];
};

// 预览图配置
export type TypeTempPageConf = {
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
    to: TypeTempTo["src"];
  }[];
  xml: any[];
};

// -----------------------
// 以下是预览数据
export type TypePreviewData = {
  previewConf: TypeTemplateConf;
  imageData: TypeImageData[];
  pageConfData: TypePageConfData[];
};
// 储存在数据库的项目数据
export type TypeProjectData = {
  brandInfo: TypeBrandInfo;
  projectInfo: TypeProjectInfo;
  templateConf: TypeTemplateConf;
  previewData: TypePreviewData;
  projectResource: any;
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
export type TypePageConfData = {
  key: string;
  md5?: string;
  conf: TypeTempPageConf | null;
};
