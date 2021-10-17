import { HEX_FORMAT } from "src/enum/index";
import { FileTypeResult, MimeType } from "file-type";
import { Element } from "xml-js";
import {
  ALIGN_VALUE,
  ALIGN_V_VALUE,
  RESOURCE_TAG,
  RESOURCE_PROTOCOL,
  LAYOUT_ELEMENT_TAG
} from "../enum";
import XMLNodeBase from "../server/compiler/XMLNodeElement";
import { TypeImageData } from "./project";

/*************************** Resource ***************************/
type Diff<T, U> = T extends U ? never : T;

type PickType<T, U> = T extends U ? T : never;

// src="src://" 数据
export type TypeSourceData = {
  protocol: string;
  src: string;
  query: Record<string, string>;
};

export type TypeImageMimeType =
  | "image/jpeg"
  | "image/png"
  | "image/gif"
  | "image/webp";

// fileData
export type TypeFileData =
  | {
      fileType:
        | Diff<
            MimeType,
            TypeImageFileData["fileType"] | TypeXmlFileData["fileType"]
          >
        | "";
      size: number;
    }
  | TypeImageFileData
  | TypeXmlFileData;

export type TypeImageFileData = {
  fileType: TypeImageMimeType | "";
  width: number;
  height: number;
  size: number;
  is9patch: boolean;
};
export type TypeXmlFileData = {
  fileType: "application/xml" | "";
  size: number;
  element: Element;
  valueMapper: Record<string, string | undefined>;
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

export type TypeXmlBlocker<T = TypeXmlValueTags> = {
  readonly tag: T;
  key: string;
  name: string;
  items: TypeXmlItem[];
};

// String
export type TypeStringBlocker = TypeXmlBlocker<RESOURCE_TAG.String>;
// Color
export type TypeColorBlocker = TypeXmlBlocker<RESOURCE_TAG.Color>;
// Number
export type TypeNumberBlocker = TypeXmlBlocker<RESOURCE_TAG.Number>;
// Boolean
export type TypeBooleanBlocker = TypeXmlBlocker<RESOURCE_TAG.Boolean>;

// Image
export type TypeFileBlocker = {
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

// Resource
export type TypeResourceDefinition = {
  key: string;
  name: string;
  extra: Record<string, string>; // 备用字段
  children: Array<
    | TypeFileBlocker
    | TypeStringBlocker
    | TypeColorBlocker
    | TypeNumberBlocker
    | TypeBooleanBlocker
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