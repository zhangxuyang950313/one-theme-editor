import { Element } from "xml-js";
import { ALIGN_VALUES, ALIGN_V_VALUES, ELEMENT_TYPES } from "src/enum";
import XMLNodeElement from "server/compiler/XMLNodeElement";
import { TypeImageData, TypeUiVersion } from "./project";
import { TypeImagePathLike } from "./index";

// 资源配置简略信息
export type TypeSourceConfigBrief = {
  key: string;
  url: string;
  name: string;
  preview: TypeImagePathLike;
  version: string;
  uiVersion: TypeUiVersion;
};

// 资源配置
export type TypeSourceConfig = Omit<TypeSourceConfigBrief, "key"> & {
  sourceTypeList: TypeSourceTypeConf[];
  moduleList: TypeSourceModuleConf[];
};

// 预览模块
export type TypeSourceModuleConf = {
  index: number;
  name: string;
  icon: string;
  groupList: TypeSourcePageGroupConf[];
};

// 预览页面组
export type TypeSourcePageGroupConf = {
  name: string;
  pageList: TypeSourcePageConf[];
};

// 键值对配置数据
export type TypeSourcePageKeyValConf = {
  [k: string]: {
    value: string;
    description: string;
  };
};

// 配置模板数据
export type TypeSourceXmlTempConf = {
  template: string;
  release: string;
  valueMap: TypeSourcePageKeyValConf;
};

// 拷贝配置数据
export type TypeSourceCopyConf = {
  from: string;
  release: string;
};

// 图片元素数据
export type TypeSourceImageElement = {
  type: ELEMENT_TYPES.IMAGE;
  name: string;
  source: (TypeImageData & { url: string }) | null;
  layout: {
    x: string;
    y: string;
    w: string;
    h: string;
    align: ALIGN_VALUES;
    alignV: ALIGN_V_VALUES;
  };
  releaseList: string[];
};

// 文字元素数据
export type TypeSourceTextElement = {
  type: ELEMENT_TYPES.TEXT;
  text: string;
  layout: {
    x: string;
    y: string;
    align: ALIGN_VALUES;
    alignV: ALIGN_V_VALUES;
  };
  color: string;
};

// 预览元素数据
export type TypeSourceElement = TypeSourceImageElement | TypeSourceTextElement;

// 预览单个页面配置
export type TypeSourcePageConf = {
  key: string;
  name: string;
  preview: string;
  src: string;
};
export type TypeSourcePageData = {
  url: string;
  version: string;
  description: string;
  screenWidth: string;
  previewList: string[];
  elementList: TypeSourceElement[];
  templateList: TypeSourceXmlTempConf[];
  copyList: TypeSourceCopyConf[];
};

// 键值对映射配置
export type TypeSourceXmlKeyValMapperConf = {
  key: string;
  value: string;
  description: string;
};

// 键值对映射 map
export type TypeSourceXmlKeyValMapperMap = Map<string, XMLNodeElement>;

// 素材类型定义数据
export type TypeSourceTypeConf = {
  tag: string;
  name: string;
  type: "image" | "xml";
};
