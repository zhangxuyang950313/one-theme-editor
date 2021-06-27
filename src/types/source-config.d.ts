import { TypeImageData, TypeUiVersion } from "./project";
import { TypeXMLSourceLayout } from "./xml-result";
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
  modules: TypeSCModuleConf[];
};

// 预览模块
export type TypeSCModuleConf = {
  index: number;
  name: string;
  icon: string;
  groups: TypeSCPageGroupConf[];
};

// 预览页面组
export type TypeSCPageGroupConf = {
  name: string;
  pages: TypeSCPageConf[];
};

// 预览页面信息
export type TypeSCPageInfoConf = {
  version: string;
  description: string;
  screenWidth: string;
};

// 资源文件类型
export type TypeSCFileCategoryConf = {
  tag: string;
  description: string;
  type: "image" | "xml" | "" | string;
};

// 预览页面资源素材配置
export type TypeSCPageSourceConf = {
  name: string;
  layout: TypeXMLSourceLayout; // 预览所需坐标
  from: (TypeImageData & { pathname: TypeImagePathLike }) | null;
  to: string[];
};

// 预览单个页面配置
export type TypeSCPageConf = {
  config: TypeSCPageInfoConf;
  preview: TypeImagePathLike;
  category: TypeSCFileCategoryConf[];
  source: TypeSCPageSourceConf[];
  xml: any[];
};
