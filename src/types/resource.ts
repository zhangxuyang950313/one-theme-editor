import archiver from "archiver";
import {
  RESOURCE_PROTOCOL,
  RESOURCE_TYPE,
  FILE_TEMPLATE_TYPE,
  ELEMENT_TAG,
  ALIGN_VALUE,
  ALIGN_V_VALUE,
  PACK_TYPE,
  FILE_TYPE
} from "../enum";
import XMLNodeBase from "../server/compiler/XMLNodeElement";
import { TypeImageData, TypeUiVersion } from "./project";

// 资源配置信息
export type TypeResourceOption = {
  key: string;
  namespace: string;
  config: string;
  name: string;
  preview: string;
  version: string;
  uiVersion: TypeUiVersion;
};

// 资源配置数据
export type TypeResourceConfig = TypeResourceOption & {
  resTypeList: TypeResTypeConfig[];
  moduleList: TypeResModule[];
};

export type TypeFileTemplateConfig = {
  output: string;
  type: FILE_TEMPLATE_TYPE;
  items: Array<{
    name: string;
    description: string;
    disabled: boolean;
    visible: boolean;
  }>;
  template: string;
};

// 打包配置
export type TypePackConfig = {
  extname: string;
  format: archiver.Format;
  execute9patch: boolean;
  items: Array<{ type: PACK_TYPE; pattern: string }>;
  excludes: Array<{ regex: string; pattern: string }>;
};

// 应用配置
export type TypeApplyConfig = {
  steps: Array<{ description: string; command: string }>;
};

// 场景配置选项
export type TypeScenarioOption = {
  name: string;
  md5: string;
  src: string;
} & TypeScenarioConfig;

// 场景配置数据
export type TypeScenarioConfig = {
  fileTempList: TypeFileTemplateConfig[];
  packageConfig: TypePackConfig;
  applyConfig: TypeApplyConfig;
};

// 素材类型定义数据
export type TypeResTypeConfig = {
  type: RESOURCE_TYPE;
  protocol: RESOURCE_PROTOCOL;
  name: string;
};
// 预览模块
export type TypeResModule = {
  index: number;
  name: string;
  icon: string;
  pageGroupList: TypeResPageGroup[];
};

// 预览页面组
export type TypeResPageGroup = {
  name: string;
  pageList: TypeResPageOption[];
};

// 键值对配置数据
export type TypeXmlTempKeyValMap = Map<
  string,
  { value: string; description: string }
>;

// 键值对映射配置
export type TypeXmlKeyValConfig = {
  name: string;
  value: string;
  description: string;
};

// 配置模板原始配置
export type TypeXmlTempConfig = {
  template: string;
  values: string;
  release: string;
};

export type TypeLayoutData = {
  x: string;
  y: string;
  w: string;
  h: string;
  align: ALIGN_VALUE;
  alignV: ALIGN_V_VALUE;
};

// 图片元素数据
export type TypeLayoutImageElement = {
  tag: ELEMENT_TAG.Image;
  resType: RESOURCE_TYPE.IMAGE;
  protocol: RESOURCE_PROTOCOL;
  src: string;
  url: string;
  layout: TypeLayoutData;
};

export type TypeXmlValueData = {
  defaultValue: string;
  valueName: string;
};
// 颜色元素数据
export type TypeLayoutTextElement = {
  tag: ELEMENT_TAG.Text;
  resType:
    | RESOURCE_TYPE.COLOR
    | RESOURCE_TYPE.BOOLEAN
    | RESOURCE_TYPE.NUMBER
    | RESOURCE_TYPE.STRING;
  protocol: RESOURCE_PROTOCOL;
  text: string;
  color: string;
  layout: TypeLayoutData;
};

// 预览元素数据
export type TypeLayoutElement = TypeLayoutImageElement | TypeLayoutTextElement;

// 素材定义数据
// 图片类型
export type TypeImageSourceData = {
  fileType: FILE_TYPE.IMAGE;
  protocol: string;
  src: string;
  query: Record<string, string>;
  data: TypeImageData;
};
export type TypeResImageDefinition = {
  resType: RESOURCE_TYPE.IMAGE;
  fileType: FILE_TYPE.IMAGE;
  name: string;
  desc: string;
  url: string;
  source: string;
  sourceData: TypeImageSourceData;
};
// xml类型
export type TypeXmlValSourceData = {
  fileType: FILE_TYPE.XML;
  protocol: string;
  src: string;
  query: Record<string, string>;
  data: TypeXmlValueData;
};
export type TypeResXmlValDefinition = {
  fileType: FILE_TYPE.XML;
  resType:
    | RESOURCE_TYPE.UNKNOWN
    | RESOURCE_TYPE.COLOR
    | RESOURCE_TYPE.BOOLEAN
    | RESOURCE_TYPE.NUMBER
    | RESOURCE_TYPE.STRING;
  name: string;
  desc: string;
  source: string;
  sourceData: TypeXmlValSourceData;
};
export type TypeResDefinition =
  | TypeResImageDefinition
  | TypeResXmlValDefinition;

// URL 未知
export type TypeResUnknownData = {
  protocol: RESOURCE_PROTOCOL.UNKNOWN;
  fileType: FILE_TYPE.UNKNOWN;
  source: string;
  src: string;
  srcpath: string;
  query: Record<string, string>;
  data: null;
};

// URL 图片
export type TypeResUrlImageData = {
  protocol: RESOURCE_PROTOCOL;
  fileType: FILE_TYPE.IMAGE;
  source: string;
  src: string;
  srcpath: string;
  query: Record<string, string>;
  data: TypeImageData;
};

// URL xml 值
export type TypeResUrlXmlValData = {
  protocol: RESOURCE_PROTOCOL;
  fileType: FILE_TYPE.XML;
  source: string;
  src: string;
  srcpath: string;
  query: Record<string, string>;
  data: TypeXmlValueData;
};

export type TypeResUrlData =
  | TypeResUnknownData
  | TypeResUrlImageData
  | TypeResUrlXmlValData;

// 预览单个页面配置
export type TypeResPageOption = {
  key: string;
  name: string;
  preview: string;
  src: string;
};
export type TypeResPageConfig = {
  config: string;
  version: string;
  description: string;
  screenWidth: string;
  previewList: string[];
  resourceList: TypeResDefinition[];
  layoutElementList: TypeLayoutElement[];
};

// 键值对映射 map
export type TypeXmlKeyValMapperMap = Map<string, XMLNodeBase>;
