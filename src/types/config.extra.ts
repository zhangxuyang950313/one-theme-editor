import { EXTRA_DATA_TYPE } from "../enum/index";
import { TypeDatabase } from "../types/utils";

export type TypePathCollection = Readonly<{
  ELECTRON_CACHE: string;
  ELECTRON_TEMP: string;
  ELECTRON_APP_DATA: string;
  ELECTRON_DESKTOP: string;
  ELECTRON_DOCUMENTS: string;
  ELECTRON_DOWNLOADS: string;
  ELECTRON_EXE: string;
  ELECTRON_HOME: string;
  ELECTRON_LOGS: string;
  ELECTRON_APP_PATH: string;
  ELECTRON_LOCAL: string;
  APP_DATA: string;
  CLIENT_STATIC: string;
  CLIENT_CACHE: string;
  PACK_TEMPORARY: string;
  EXTRA_DATA_DB: string;
  PROJECTS_DB: string;
  PROJECT_THUMBNAIL_DIR: string;
  RESOURCE_DIR: string;
  ASSETS_DIR: string;
  BINARY_DIR: string;
  RESOURCE_CONFIG_DIR: string;
  RESOURCE_CONFIG_FILE: string;
  AAPT_TOOL: string | null;
  ADB_TOOL: string | null;
}>;

export type TypePathConfigInDoc = {
  readonly type: EXTRA_DATA_TYPE.PATH_CONFIG;
} & TypeDatabase<TypePathCollection>;

export type TypeServerConfig = {
  host: string;
  port: number;
};

export type TypeServerConfigInDoc = {
  readonly type: EXTRA_DATA_TYPE.SERVER_CONFIG;
} & TypeDatabase<TypeServerConfig>;
