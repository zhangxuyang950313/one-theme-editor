import { FileTypeResult } from "file-type";
import {
  RESOURCE_PROTOCOL,
  ELEMENT_TAG,
  ALIGN_VALUE,
  ALIGN_V_VALUE,
  RESOURCE_TAG,
  LAYOUT_ELEMENT_TAG
} from "../enum";
import XMLNodeBase from "../server/compiler/XMLNodeElement";
import { TypeImageData } from "./project";

/*************************** Resource ***************************/

// src="src://" 数据
export type TypeSourceData = {
  fileType: string;
  extname: string;
  size: number;
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
  items: TypeXmlValueItem[];
};
// <Xml/> 节点下的子节点
export type TypeXmlValueItem = {
  tag: string;
  comment: string;
  attributes: [string, string][];
};

export type TypeXmlTypeTags =
  | RESOURCE_TAG.String
  | RESOURCE_TAG.Color
  | RESOURCE_TAG.Number
  | RESOURCE_TAG.Boolean;

export type TypeXmlTypeBlock<T = TypeXmlTypeTags> = {
  readonly tag: T;
  key: string;
  name: string;
  items: TypeXmlItem[];
};

// String
export type TypeStringBlock = TypeXmlTypeBlock<RESOURCE_TAG.String>;
// Color
export type TypeColorBlock = TypeXmlTypeBlock<RESOURCE_TAG.Color>;
// Number
export type TypeNumberBlock = TypeXmlTypeBlock<RESOURCE_TAG.Number>;
// Boolean
export type TypeBooleanBlock = TypeXmlTypeBlock<RESOURCE_TAG.Boolean>;

// Image
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
};

// Resource
export type TypeResourceDefinition = {
  key: string;
  name: string;
  children: Array<
    | TypeFileBlock
    | TypeStringBlock
    | TypeColorBlock
    | TypeNumberBlock
    | TypeBooleanBlock
  >;
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
  resType: RESOURCE_TAG.File;
  source: string;
  sourceData: TypeSourceData;
  layout: TypeLayoutData;
};

// 颜色元素数据
export type TypeLayoutTextElement = {
  tag: LAYOUT_ELEMENT_TAG.Text;
  resType: RESOURCE_TAG.Color;
  text: string;
  size: string;
  color: string;
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

export type TypeImageUrlData = TypeUrlData<TypeImageData>;
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
