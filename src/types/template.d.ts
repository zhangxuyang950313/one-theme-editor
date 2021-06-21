import { TypeUiVersionInfo, TypeImageInfo } from "./project.d";
import { TypeTempLayout } from "./xml-result.d";

export type TypeUiVersionConf = TypeUiVersionInfo & {
  src: string;
};

export type TypeTempPageGroupConf = {
  name: string;
  pages: TypeTempPageConf[];
};

export type TypeTempModuleConf = {
  index: number;
  name: string;
  icon: string | null;
  groups: TypeTempPageGroupConf[];
};

/**
 * 模板预览配置（因为在创建工程之前，没有 ui 版本信息，无法确认使用哪个模板）
 */
export type TypeTemplateConf = {
  key: string;
  root: string;
  file: string;
  name: string;
  preview: TypeImageInfo | null;
  version: string;
  uiVersions: TypeUiVersionConf[];
};

export type TypeTemplateData = Pick<
  TypeTemplateConf,
  "name" | "preview" | "version" | "uiVersions"
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
  preview: string | null;
  category: TypeTempPageCategoryConf[];
  source: TypeTempPageSourceConf[];
  xml: any[];
};
