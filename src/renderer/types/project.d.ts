import { projectInfoConfig } from "@/config/editor";
import { TypeTempFrom, TypeTempLayout, TypeTempTo } from "./xml-result";

// 品牌信息
export type TypeBrandInfo = {
  templateDir: string;
  name: string;
};

// 模板支持 ui
export type TypeTempUiVersion = {
  name: string;
  src: string;
  code: string;
};
// 模板预览分类
export type TypeTempPreviewClass = {
  name: string;
  pages: string[]; // 页面配置路径
};
// 模板模块配置
export type TypeTempModule = {
  name: string; // 模块名称
  icon: string; // 模块图标，用于侧边栏显示
  // 预览图类型
  previewClass: TypeTempPreviewClass[];
};
// 模板配置信息汇总
export type TypeTempConf = {
  key: string; // 随机键值
  root: string;
  // brandInfo?: TypeBrandInfo;
  name: string; // 模板名称
  cover: string; // 模板缩略图
  version: string; //
  uiVersions: TypeTempUiVersion[] | []; // 系统 UI 版本
  modules: TypeTempModule[];
};

// 项目描述信息
export type TypeProjectInfo = {
  [k in keyof typeof projectInfoConfig]: string;
};

// 预览图配置
export type TypeTempPageConf = {
  pageKey: string;
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

export type TypeClassConf = {
  name: string;
  pages: string[];
};
export type TypePreviewConf = {
  modules: {
    name: string;
    classList: TypeClassConf[];
  }[];
  pageConfList: Array<TypeTempPageConf>;
};
// 储存在数据库的项目数据
export type TypeProjectData = {
  brandInfo: TypeBrandInfo;
  projectInfo: TypeProjectInfo;
  templateConf: TypeTempConf;
  previewConf: TypePreviewConf;
  projectResource: any;
};

// 从数据库取出的项目文档数据
export type TypeDatabase<T = { [x: string]: any }> = T & {
  _id: string;
  createAt?: Date;
  updateAt?: Date;
};
