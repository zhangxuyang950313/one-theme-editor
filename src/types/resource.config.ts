import { HEX_FORMAT } from "src/enum";
import { TypeUiVersion } from "./project";
import { TypeLayoutElement, TypeResourceDefinition } from "./resource.page";

// 预览单个页面配置
export type TypePageOption = {
  key: string;
  name: string;
  preview: string;
  src: string;
};
export type TypePageConfig = {
  config: string;
  version: string;
  name: string;
  screenWidth: string;
  disableTabs: boolean;
  colorFormat: HEX_FORMAT;
  forceStaticPreview: boolean;
  previewList: string[];
  resourceList: TypeResourceDefinition[];
  layoutElementList: TypeLayoutElement[];
};

// 资源配置信息
export type TypeResourceOption = {
  key: string;
  namespace: string;
  src: string;
  name: string;
  preview: string;
  version: string;
  uiVersion: TypeUiVersion;
};

// 预览模块
export type TypeModuleConfig = {
  index: number;
  name: string;
  icon: string;
  pageList: TypePageOption[];
};

// 资源配置数据
export type TypeResourceConfig = TypeResourceOption & {
  moduleList: TypeModuleConfig[];
};
