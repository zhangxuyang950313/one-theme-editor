import archiver from "archiver";
import {
  ALIGN_VALUES,
  ALIGN_V_VALUES,
  ELEMENT_TAG,
  FILE_TEMPLATE_TYPE,
  PACK_TYPE,
  RESOURCE_TYPES
} from "../enum";
import XMLNodeBase from "../server/compiler/XMLNodeElement";
import { TypeImageData, TypeProjectUiVersion } from "./project";
import { TypeImagePathLike } from "./index";

// 资源配置信息
export type TypeResourceOption = {
  key: string;
  namespace: string;
  config: string;
  name: string;
  preview: TypeImagePathLike;
  version: string;
  uiVersion: TypeProjectUiVersion;
};

// 资源配置数据
export type TypeResourceConfig = TypeResourceOption & {
  resourceTypeList: TypeResourceTypeConf[];
  resourceModuleList: TypeResourceModuleConf[];
};

export type TypeFileTemplateConf = {
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
export type TypePackConf = {
  extname: string;
  format: archiver.Format;
  execute9patch: boolean;
  items: Array<{ type: PACK_TYPE; pattern: string }>;
  excludes: Array<{ regex: string; pattern: string }>;
};

// 应用配置
export type TypeApplyConf = {
  steps: Array<{ description: string; command: string }>;
};

// 场景配置数据
export type TypeScenarioConf = {
  name: string;
  md5: string;
  fileTempList: TypeFileTemplateConf[];
  packageConfig: TypePackConf;
  applyConfig: TypeApplyConf;
};

// 场景配置选项
export type TypeScenarioOption = TypeScenarioConf & {
  src: string;
};

// 素材类型定义数据
export type TypeResourceTypeConf = {
  type: RESOURCE_TYPES;
  name: string;
  tag: string;
};

// 预览模块
export type TypeResourceModuleConf = {
  index: number;
  name: string;
  icon: string;
  groupList: TypeResourcePageGroupConf[];
};

// 预览页面组
export type TypeResourcePageGroupConf = {
  name: string;
  pageList: TypeResourcePageOption[];
};

// 键值对配置数据
export type TypeXmlTempKeyValMap = Map<
  string,
  { value: string; description: string }
>;

// 键值对映射配置
export type TypeResourceXmlKeyValConf = {
  name: string;
  value: string;
  description: string;
};

// 配置模板原始配置
export type TypeResourceXmlTempConf = {
  template: string;
  values: string;
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

// 图片元素数据
export type TypeLayoutImageElement = {
  readonly resourceTag: ELEMENT_TAG.Image;
  readonly resourceType: RESOURCE_TYPES.IMAGE;
  description: string;
  src: string;
  resourceData: TypeResourceImageData;
  layout: {
    x: string;
    y: string;
    w: string;
    h: string;
    align: ALIGN_VALUES;
    alignV: ALIGN_V_VALUES;
  };
};

// 颜色元素数据
export type TypeLayoutTextElement = {
  readonly resourceTag: ELEMENT_TAG.Text;
  readonly resourceType: RESOURCE_TYPES;
  name: string;
  text: string;
  src: string;
  valueData: TypeResourceValueData | null;
  layout: {
    x: string;
    y: string;
    align: ALIGN_VALUES;
    alignV: ALIGN_V_VALUES;
  };
};

export type TypeResourceValueData = {
  defaultValue: string;
  valueName: string;
};

export type TypeResourceImageData = TypeImageData;

// 素材定义
export type TypeResourceImageDefinition = {
  tagName: string;
  name: string;
  description: string;
  src: string;
  resourceData: TypeResourceImageData | null;
  valueData: null;
};
export type TypeResourceValueDefinition = {
  tagName: string;
  name: string;
  description: string;
  src: string;
  resourceData: null;
  valueData: TypeResourceValueData | null;
};
export type TypeResourceDefinition =
  | TypeResourceImageDefinition
  | TypeResourceValueDefinition;

// 预览元素数据
export type TypeLayoutElement = TypeLayoutImageElement | TypeLayoutTextElement;

// 预览单个页面配置
export type TypeResourcePageOption = {
  key: string;
  name: string;
  preview: string;
  src: string;
};
export type TypeResourcePageConf = {
  config: string;
  version: string;
  description: string;
  screenWidth: string;
  previewList: string[];
  resourceDefinitionList: TypeResourceDefinition[];
  layoutElementList: TypeLayoutElement[];
};

// 键值对映射 map
export type TypeResourceXmlKeyValMapperMap = Map<string, XMLNodeBase>;
