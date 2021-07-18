import {
  ALIGN_VALUES,
  ALIGN_V_VALUES,
  ELEMENT_TAG,
  SOURCE_TYPES
} from "../enum";
import XMLNodeBase from "../server/compiler/XMLNodeElement";
import { TypeImageData, TypeProjectUiVersion } from "./project";
import { TypeImagePathLike } from "./index";

// 资源配置信息
export type TypeSourceConfigInfo = {
  key: string;
  root: string;
  config: string;
  name: string;
  preview: TypeImagePathLike;
  version: string;
  uiVersion: TypeProjectUiVersion;
};

// 资源配置数据
export type TypeSourceConfigData = TypeSourceConfigInfo & {
  sourceTypeList: TypeSourceTypeConf[];
  moduleList: TypeSourceModuleConf[];
};

// 素材类型定义数据
export type TypeSourceTypeConf = {
  name: string;
  tag: string;
  sourceType: SOURCE_TYPES;
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
export type TypeXmlTempKeyValMap = Map<
  string,
  { value: string; description: string }
>;

// 键值对映射配置
export type TypeSourceXmlKeyValConf = {
  name: string;
  value: string;
  description: string;
};

// 配置模板原始配置
export type TypeSourceXmlTempConf = {
  template: string;
  values: string;
  release: string;
};

// 拷贝配置数据
export type TypeSourceCopyConf = {
  from: string;
  release: string;
};

export type TypeLayoutConf = {
  x: string;
  y: string;
  w: string;
  h: string;
  align: ALIGN_VALUES;
  alignV: ALIGN_V_VALUES;
};

export type TypeSourceImageData = TypeImageData & {
  src: string;
};

// 图片元素数据
export type TypeSourceImageElement = {
  readonly sourceTag: ELEMENT_TAG.IMAGE;
  readonly sourceType: SOURCE_TYPES.IMAGE;
  name: string;
  sourceData: TypeSourceImageData;
  layout: {
    x: string;
    y: string;
    w: string;
    h: string;
    align: ALIGN_VALUES;
    alignV: ALIGN_V_VALUES;
  };
  // releaseList: string[];
};

// 颜色元素数据
export type TypeSourceTextElement = {
  readonly sourceTag: ELEMENT_TAG.TEXT;
  readonly sourceType: SOURCE_TYPES;
  name: string;
  text: string;
  valueData: {
    defaultValue: string;
    valueName: string;
    src: string;
  };
  layout: {
    x: string;
    y: string;
    align: ALIGN_VALUES;
    alignV: ALIGN_V_VALUES;
  };
};

// 值定义
export type TypeSourceDefine = {
  tagName: string;
  name: string;
  description: string;
  valueData: {
    defaultValue: string;
    valueName: string;
    src: string;
  };
};

// 预览元素数据
export type TypeSourceLayoutElement =
  | TypeSourceImageElement
  | TypeSourceTextElement;

// 预览单个页面配置
export type TypeSourcePageConf = {
  key: string;
  name: string;
  preview: string;
  src: string;
};
export type TypeSourcePageData = {
  config: string;
  version: string;
  description: string;
  screenWidth: string;
  previewList: string[];
  sourceDefineList: TypeSourceDefine[];
  layoutElementList: TypeSourceLayoutElement[];
  copyList: TypeSourceCopyConf[];
};

// 键值对映射 map
export type TypeSourceXmlKeyValMapperMap = Map<string, XMLNodeBase>;
