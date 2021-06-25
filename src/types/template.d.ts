import { TypeImageInfo } from "./project.d";
import { TypeTempLayout } from "./xml-result.d";

export type TypeUiVersion = {
  name: string;
  code: string;
};

export type TypeTempPageGroupConf = {
  name: string;
  pages: TypeTempPageConf[];
};

export type TypeTempModuleConf = {
  index: number;
  name: string;
  icon: string;
  groups: TypeTempPageGroupConf[];
};

// 预览配置
export type TypeSourceConfig = {
  key: string;
  root: string;
  file: string;
  name: string;
  preview: TypeImageInfo;
  version: string;
  uiVersion: TypeUiVersion;
};

export type TypeTemplateData = Pick<
  TypeSourceConfig,
  "name" | "preview" | "version" | "uiVersion"
> & {
  modules: TypeTempModuleConf[];
};

export type TypeTempPageConfigConf = {
  version: string;
  description: string;
  screenWidth: string;
};

export type TypeTempPageCategoryConf = {
  tag: string;
  description: string;
  type: "image" | "xml" | "";
};

export type TypeTempPageSourceConf = {
  name: string;
  layout: TypeTempLayout;
  from: TypeImageInfo | null;
  to: string[];
};

export type TypeTempPageConf = {
  pathname: string;
  config: TypeTempPageConfigConf;
  preview: string;
  category: TypeTempPageCategoryConf[];
  source: TypeTempPageSourceConf[];
  xml: any[];
};
