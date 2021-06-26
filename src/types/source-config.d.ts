import { TypeImageData } from "./project";
import { TypeTempLayout } from "./xml-result";
import { TypeImagePathLike } from "./index";

// 资源预览配置
export type TypeSourceDescription = {
  key: string;
  namespace: string;
  name: string;
  preview: TypeImagePathLike;
  version: string;
  uiVersion: TypeUiVersion;
};

// 资源配置
export type TypeSourceConfig = Omit<TypeSourceDescription, "key"> & {
  modules: TypeSourceModuleConf[];
};

// 版本信息
export type TypeUiVersion = {
  name: string;
  code: string;
};

// 预览模块
export type TypeSourceModuleConf = {
  index: number;
  name: string;
  icon: string;
  groups: TypeSourcePageGroupConf[];
};

// 预览页面组
export type TypeSourcePageGroupConf = {
  name: string;
  pages: TypeSourcePageConf[];
};

// 预览页面信息
export type TypeSourcePageInfoConf = {
  version: string;
  description: string;
  screenWidth: string;
};

// 资源文件类型
export type TypeSourceFileCategoryConf = {
  tag: string;
  description: string;
  type: "image" | "xml" | "";
};

// 预览页面资源素材配置
export type TypeSourcePageSourceConf = {
  name: string;
  layout: TypeTempLayout; // 预览所需坐标
  from: TypeImageData | null;
  to: string[];
};

// 预览单个页面配置
export type TypeSourcePageConf = {
  pathname: string;
  config: TypeSourcePageInfoConf;
  preview: TypeImagePathLike;
  category: TypeSourceFileCategoryConf[];
  source: TypeSourcePageSourceConf[];
  xml: any[];
};
