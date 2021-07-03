import { Attributes } from "xml-js";
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
  moduleList: TypeSCModuleConf[];
};

// 预览模块
export type TypeSCModuleConf = {
  index: number;
  name: string;
  icon: string;
  groupList: TypeSCPageGroupConf[];
};

// 预览页面组
export type TypeSCPageGroupConf = {
  name: string;
  pageList: TypeSCPageConf[];
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
  valueList: TypeKeyValMapperConf[];
  to: string;
};

// 拷贝数据
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
  source: (TypeImageData & { pathname: string }) | null;
  layout: {
    x: string;
    y: string;
    w: string;
    h: string;
    align: TypeElementAlign;
    alignV: TypeElementAlignV;
  };
  toList: string[];
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

// 预览元素数据
export type TypeSCPageElementData =
  | TypeSCPageImageElData
  | TypeSCPageTextElData;

// 预览页面资源素材配置
export type TypeSCPageSourceConf = {
  name: string;
  layout: TypeXMLSourceLayout; // 预览布局信息
  from: (TypeImageData & { relativePath: TypeImagePathLike }) | null;
  to: string[];
};

// 预览单个页面配置
export type TypeSCPageConf = {
  version: string;
  description: string;
  screenWidth: string;
  previewList: string[];
  elementList: TypeSCPageElementData[];
  templateList: TypeSCPageTemplateConf[];
  copyList: TypeSCPageCopyConf[];
};

// 键值对映射配置
export type TypeKeyValMapperConf = {
  key: string;
  value: string;
  description: string;
};

// xml 模板数据
export type TypeXmlTempData = {
  name: string;
  attribute: Attributes;
  child: string;
};
