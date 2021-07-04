import { Attributes, Element } from "xml-js";
import { ALIGN_VALUES, ALIGN_V_VALUES, ELEMENT_TYPES } from "src/enum";
import XMLNodeElement from "server/compiler/XMLNodeElement";
import { TypeImageData, TypeUiVersion } from "./project";
import { TypeXMLSourceLayout } from "./xml-result";
import { TypeImagePathLike } from "./index";

// 资源预览配置
export type TypeSourceDescription = {
  key: string;
  file: string;
  name: string;
  preview: TypeImagePathLike;
  version: string;
  uiVersion: TypeUiVersion;
};

// 资源配置
export type TypeSourceConfig = Omit<TypeSourceDescription, "key"> & {
  sourceTypeList: TypeSCPageSourceTypeConf[];
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

// 键值对配置数据
export type TypeSCPageKeyValConf = {
  [k: string]: {
    value: string;
    description: string;
  };
};

// 配置模板数据
export type TypeSCPageTemplateConf = {
  template: Element[];
  valueMap: TypeSCPageKeyValConf;
  to: string;
};

// 拷贝数据
export type TypeSCPageCopyConf = {
  from: string;
  to: string;
};

// 元素配置数据
export type TypeElementAlign = ALIGN_VALUES;
export type TypeElementAlignV = ALIGN_V_VALUES;

export type TypeSCPageImageElement = {
  type: ELEMENT_TYPES.IMAGE;
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
  releaseList: string[];
};

export type TypeSCPageTextElement = {
  type: ELEMENT_TYPES.TEXT;
  text: string;
  layout: {
    x: string;
    y: string;
    align: TypeElementAlign;
    alignV: TypeElementAlignV;
  };
  color: string;
};

// 预览元素数据
export type TypeSCPageSourceElement =
  | TypeSCPageImageElement
  | TypeSCPageTextElement;

// 预览页面资源素材配置
export type TypeSCPageSourceConf = {
  name: string;
  layout: TypeXMLSourceLayout; // 预览布局信息
  from: (TypeImageData & { relativePath: TypeImagePathLike }) | null;
  to: string[];
};

// 预览单个页面配置
export type TypeSCPageConf = {
  name: string;
  preview: string;
  src: string;
};
export type TypeSCPageData = {
  version: string;
  description: string;
  screenWidth: string;
  previewList: string[];
  elementList: TypeSCPageSourceElement[];
  templateList: TypeSCPageTemplateConf[];
  copyList: TypeSCPageCopyConf[];
};

// 键值对映射配置
export type TypeSCPageXmlKeyValMapperConf = {
  key: string;
  value: string;
  description: string;
};

// 键值对映射 map
export type TypeSCPageXmlKeyValMapperMap = Map<string, XMLNodeElement>;

// xml 模板数据
export type TypeSCPageXmlTempData = {
  name: string;
  attribute: Attributes;
  child: string;
};

// 素材类型定义数据
export type TypeSCPageSourceTypeConf = {
  tag: string;
  name: string;
  type: "image" | "xml";
};
