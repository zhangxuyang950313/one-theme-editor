import { MimeType } from "file-type";
import { Element } from "xml-js";

import { Diff } from "./utils";

// 图片 filetype
export type TypeImageFiletype =
  | "image/jpeg"
  | "image/png"
  | "image/apng"
  | "image/gif"
  | "image/webp";

// 图片文件数据
export type TypeImageFileData = {
  filetype: TypeImageFiletype | "";
  width: number;
  height: number;
  size: number;
  filename: string;
  is9patch: boolean;
};

// xml 文件数据
export type TypeXmlFileData = {
  readonly filetype: "application/xml";
  size: number;
  element: Element;
  valueMapper: Record<string, string>;
};

// 不支持的文件数据
export type TypeUnSupportFileData = {
  filetype:
    | Diff<
        MimeType,
        TypeImageFileData["filetype"] | TypeXmlFileData["filetype"]
      >
    | "";
  size: number;
};

// fileData
export type TypeFileData =
  | TypeUnSupportFileData
  | TypeImageFileData
  | TypeXmlFileData;
