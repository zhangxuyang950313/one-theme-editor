import { TypeUiVersionInfo, TypeImageMapper, TypeImageFrom } from "./project.d";
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
  icon: string;
  groups: TypeTempPageGroupConf[];
};

export type TypeTemplateConf = {
  key: string;
  root: string;
  file: string;
  name: string;
  preview: TypeImageMapper | null;
  version: string;
  uiVersions: TypeUiVersionConf[];
};

export type TypeTemplateInfo = {
  name: string;
  preview: TypeImageMapper | null;
  version: string;
  uiVersions: TypeUiVersionConf[];
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
  from: TypeImageFrom | null;
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
