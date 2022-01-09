import { FileTypeResult } from "file-type";
import { ALIGN_VALUE, ALIGN_V_VALUE, RESOURCE_TAG, RESOURCE_PROTOCOL, LAYOUT_ELEMENT_TAG } from "src/common/enums";
import XMLNodeBase from "src/common/classes/XMLNodeElement";

import type { TypeFileData, TypeImageFileData } from "./file-data";

/*************************** Resource ***************************/

// src="src://" 数据
export type TypeSourceData = {
  protocol: string;
  src: string;
  query: Record<string, string>;
};

// Xml 节点
export type TypeXmlNodeData = {
  tag: string;
  key: string;
  name: string;
  sourceUrl: string;
  sourceData: TypeSourceData;
  fileData: TypeFileData;
  valueItems: TypeXmlValueData[];
};
// <Xml/> 节点下的子节点
export type TypeXmlValueData = {
  tag: string;
  keyPath: string;
  comment: string;
  attributes: [string, string][];
  value: string;
  template: string;
};

export type TypeXmlValueTags = RESOURCE_TAG.String | RESOURCE_TAG.Color | RESOURCE_TAG.Number | RESOURCE_TAG.Boolean;

export type TypeValueBlock<T = TypeXmlValueTags> = {
  readonly tag: T;
  key: string;
  name: string;
  items: TypeXmlNodeData[];
};

// String
export type TypeStringBlock = TypeValueBlock<RESOURCE_TAG.String>;
// Number
export type TypeNumberBlock = TypeValueBlock<RESOURCE_TAG.Number>;
// Boolean
export type TypeBooleanBlock = TypeValueBlock<RESOURCE_TAG.Boolean>;
// Color
export type TypeColorBlock = TypeValueBlock<RESOURCE_TAG.Color>;

// File
export type TypeFileBlock = {
  readonly tag: RESOURCE_TAG.File;
  key: string;
  name: string;
  items: TypeFileItem[];
};
export type TypeFileItem = {
  key: string;
  keyPath: string;
  comment: string;
  sourceUrl: string;
  sourceData: TypeSourceData;
  fileData: TypeFileData;
};

// 块
export type TypeBlockCollection = TypeFileBlock | TypeStringBlock | TypeColorBlock | TypeNumberBlock | TypeBooleanBlock;

// Resource 分类
export type TypeResourceCategory = {
  key: string;
  name: string;
  extra: Record<string, string>; // 备用字段
  children: Array<TypeBlockCollection>;
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
  tag: LAYOUT_ELEMENT_TAG.Image;
  keyPath: string;
  sourceUrl: string;
  sourceData: TypeSourceData;
  layout: TypeLayoutData;
};

// 颜色元素数据
export type TypeLayoutTextElement = {
  tag: LAYOUT_ELEMENT_TAG.Text;
  keyPath: string;
  text: string;
  size: string;
  color: string;
  sourceUrl: string;
  sourceData: TypeSourceData;
  valueData: TypeXmlValueData;
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
export type TypeXmlTempKeyValMap = Map<string, { value: string; description: string }>;

// 键值对映射配置
export type TypeXmlKeyValConfig = {
  name: string;
  value: string;
  description: string;
};
// 键值对映射 map
export type TypeXmlKeyValMapperMap = Map<string, XMLNodeBase>;
