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
export type TypeSCPageRootConf = {
  version: string;
  description: string;
  screenWidth: string;
};

// 配置模板数据
export type TypeSCPageTemplateConf = {
  template: any;
  values: any;
  to: string;
};

export type TypeSCPageCopyConf = {
  from: string;
  to: string;
};

// 元素配置数据
export type TypeElementAlign = "left" | "center" | "right";
export type TypeElementAlignV = "top" | "center" | "bottom";

export type TypeSCPageImageElData = {
  type: "image";
  name: string;
  src: (TypeImageData & { relativePath: TypeImagePathLike }) | null;
  layout: {
    x: string;
    y: string;
    w: string;
    h: string;
    align: TypeElementAlign;
    alignV: TypeElementAlignV;
  };
  to: string[];
};

export type TypeSCPageTextElData = {
  type: "text";
  text: string;
  layout: {
    x: string;
    y: string;
    align: TypeElementAlign;
    alignV: TypeElementAlignV;
  };
  colorClass: string;
  color: string;
};

export type TypeSCPageElementData =
  | TypeSCPageImageElData
  | TypeSCPageTextElData;

// 资源文件类型
export type TypeSCFileCategoryConf = {
  tag: string;
  description: string;
  type: "image" | "xml" | "" | string;
};

// 预览页面资源素材配置
export type TypeSCPageSourceConf = {
  name: string;
  layout: TypeXMLSourceLayout; // 预览布局信息
  from: (TypeImageData & { relativePath: TypeImagePathLike }) | null;
  to: string[];
};

// 预览单个页面配置
export type TypeSCPageConf = {
  config: TypeSCPageRootConf;
  preview: string[];
  category: TypeSCFileCategoryConf[];
  elements: TypeSCPageElementData[];
  copyList: TypeSCPageCopyConf[];
  xml: any[];
};
