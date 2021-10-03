import archiver from "archiver";
import {
  FILE_PROTOCOL,
  RESOURCE_TYPES,
  FILE_TEMPLATE_TYPE,
  ELEMENT_TAG,
  ALIGN_VALUES,
  ALIGN_V_VALUES,
  PACK_TYPE
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
  typeList: TypeResTypeData[];
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
export type TypeResTypeData = {
  type: RESOURCE_TYPES;
  name: string;
  tag: string;
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
  align: ALIGN_VALUES;
  alignV: ALIGN_V_VALUES;
};

// 图片元素数据
export type TypeLayoutImage = {
  readonly type: RESOURCE_TYPES.IMAGE;
  readonly tag: ELEMENT_TAG.Image;
  src: string;
  desc: string;
  data: TypeResImageData;
  layout: TypeLayoutData;
};

// 颜色元素数据
export type TypeLayoutText = {
  readonly type: RESOURCE_TYPES.COLOR;
  readonly tag: ELEMENT_TAG.Text;
  text: string;
  desc: string;
  src: string;
  data: TypeResValueData;
  layout: {
    x: string;
    y: string;
    align: ALIGN_VALUES;
    alignV: ALIGN_V_VALUES;
  };
};

export type TypeResValueData = {
  defaultValue: string;
  valueName: string;
};

export type TypeResImageData = TypeImageData;

// 素材定义数据
// 未知类型
export type TypeResUnknownDefinition = {
  protocol: FILE_PROTOCOL.UNKNOWN;
  type: RESOURCE_TYPES.UNKNOWN;
  name: string;
  desc: string;
  src: string;
  data: null;
};
// 图片类型
export type TypeResImageDefinition = {
  protocol: FILE_PROTOCOL.IMAGE;
  type: RESOURCE_TYPES;
  name: string;
  desc: string;
  src: string;
  data: TypeResImageData;
};
// xml文件类型
export type TypeResXmlValDefinition = {
  protocol: FILE_PROTOCOL.XML;
  type: RESOURCE_TYPES;
  name: string;
  desc: string;
  src: string;
  data: TypeResValueData;
};
export type TypeResDefinition =
  | TypeResUnknownDefinition
  | TypeResImageDefinition
  | TypeResXmlValDefinition;

// 预览元素数据
export type TypeLayoutElement = TypeLayoutImage | TypeLayoutText;

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
