import { FileTypeResult } from "file-type";
import {
  HEX_FORMAT,
  ALIGN_VALUE,
  ALIGN_V_VALUE,
  RESOURCE_TAG,
  RESOURCE_PROTOCOL,
  LAYOUT_ELEMENT_TAG
} from "../common/enums";
import XMLNodeBase from "../common/compiler/XMLNodeElement";
import { TypeFileData, TypeImageFileData } from "./file-data";

/*************************** Resource ***************************/

// src="src://" 数据
export type TypeSourceData = {
  protocol: string;
  src: string;
  query: Record<string, string>;
};

// Xml 节点
export type TypeXmlItem = {
  tag: string;
  key: string;
  name: string;
  source: string;
  sourceData: TypeSourceData;
  fileData: TypeFileData;
  valueItems: TypeXmlValueItem[];
};
// <Xml/> 节点下的子节点
export type TypeXmlValueItem = {
  md5: string;
  tag: string;
  comment: string;
  attributes: [string, string][];
  value: string;
  template: string;
};

export type TypeXmlValueTags =
  | RESOURCE_TAG.String
  | RESOURCE_TAG.Color
  | RESOURCE_TAG.Number
  | RESOURCE_TAG.Boolean;

export type TypeValueBlock<T = TypeXmlValueTags> = {
  readonly tag: T;
  key: string;
  name: string;
  items: TypeXmlItem[];
};

// String
export type TypeStringBlock = TypeValueBlock<RESOURCE_TAG.String>;
// Number
export type TypeNumberBlock = TypeValueBlock<RESOURCE_TAG.Number>;
// Boolean
export type TypeBooleanBlock = TypeValueBlock<RESOURCE_TAG.Boolean>;
// Color
export type TypeColorBlock = {
  readonly tag: RESOURCE_TAG.Color;
  key: string;
  name: string;
  format: HEX_FORMAT;
  items: TypeXmlItem[];
};

// File
export type TypeFileBlock = {
  readonly tag: RESOURCE_TAG.File;
  key: string;
  name: string;
  items: TypeFileItem[];
};
export type TypeFileItem = {
  key: string;
  comment: string;
  source: string;
  sourceData: TypeSourceData;
  fileData: TypeFileData;
};

// 块
export type TypeBlockCollection =
  | TypeFileBlock
  | TypeStringBlock
  | TypeColorBlock
  | TypeNumberBlock
  | TypeBooleanBlock;

// Resource
export type TypeResourceDefinition = {
  key: string;
  name: string;
  extra: Record<string, string>; // 备用字段
  children: Array<TypeFileBlock | TypeValueBlock<TypeXmlValueTags>>;
};

/*************************** Layout ***************************/

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
  elementTag: LAYOUT_ELEMENT_TAG.Image;
  source: string;
  sourceData: TypeSourceData;
  layout: TypeLayoutData;
};

// 颜色元素数据
export type TypeLayoutTextElement = {
  elementTag: LAYOUT_ELEMENT_TAG.Text;
  text: string;
  size: string;
  color: string;
  source: string;
  sourceData: TypeSourceData;
  valueData: TypeXmlValueItem;
  layout: TypeLayoutData;
};

// 预览元素数据
export type TypeLayoutElement = TypeLayoutImageElement | TypeLayoutTextElement;

// URL 解析数据
export type TypeUrlData<T> = {
  protocol: RESOURCE_PROTOCOL | null;
  fileType: FileTypeResult | null;
  extname: string;
  source: string;
  src: string;
  query: Record<string, string>;
  extra: T | null;
};

export type TypeImageUrlData = TypeUrlData<TypeImageFileData>;
export type TypeXmlValUrlData = TypeUrlData<{ value: string }>;

/*************************** utils ***************************/

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
// 键值对映射 map
export type TypeXmlKeyValMapperMap = Map<string, XMLNodeBase>;
