import archiver from "archiver";
import {
  ALIGN_VALUES,
  ALIGN_V_VALUES,
  ELEMENT_TAG,
  PACK_TYPE,
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

export type TypeInfoTempConf = {
  file: string;
  content: string;
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

// 品牌配置选项
export type TypeBrandOption = {
  name: string;
  md5: string;
  src: string;
  infoTemplate: TypeInfoTempConf;
  packageConfig: TypePackConf;
  applyConfig: TypeApplyConf;
};

// 厂商配置
export type TypeBrandConf = TypeBrandOption & {
  sourceConfigs: string[];
};

// 素材类型定义数据
export type TypeSourceTypeConf = {
  type: SOURCE_TYPES;
  name: string;
  tag: string;
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

// 图片元素数据
export type TypeLayoutImageElement = {
  readonly sourceTag: ELEMENT_TAG.Image;
  readonly sourceType: SOURCE_TYPES.IMAGE;
  description: string;
  src: string;
  sourceData: TypePageDefineImageData;
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
  readonly sourceTag: ELEMENT_TAG.Text;
  readonly sourceType: SOURCE_TYPES;
  name: string;
  text: string;
  src: string;
  valueData: TypePageDefineValueData | null;
  layout: {
    x: string;
    y: string;
    align: ALIGN_VALUES;
    alignV: ALIGN_V_VALUES;
  };
};

export type TypePageDefineValueData = {
  defaultValue: string;
  valueName: string;
};

export type TypePageDefineImageData = TypeImageData;

// 素材定义
export type TypeSourceDefineImage = {
  tagName: string;
  name: string;
  description: string;
  src: string;
  sourceData: TypePageDefineImageData | null;
  valueData: null;
};
export type TypeSourceDefineValue = {
  tagName: string;
  name: string;
  description: string;
  src: string;
  sourceData: null;
  valueData: TypePageDefineValueData | null;
};
export type TypeSourceDefine = TypeSourceDefineImage | TypeSourceDefineValue;

// 预览元素数据
export type TypeLayoutElement = TypeLayoutImageElement | TypeLayoutTextElement;

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
  layoutElementList: TypeLayoutElement[];
  copyList: TypeSourceCopyConf[];
};

// 键值对映射 map
export type TypeSourceXmlKeyValMapperMap = Map<string, XMLNodeBase>;
