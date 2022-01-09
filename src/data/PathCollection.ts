import { AbstractDataModel } from "./AbstractDataModel";

import type { TypePathCollection } from "src/types/config.extra";

export default class PathCollection extends AbstractDataModel<TypePathCollection> {
  protected data: TypePathCollection = {
    ELECTRON_APP_DATA: "",
    ELECTRON_APP_PATH: "",
    ELECTRON_CACHE: "",
    ELECTRON_DESKTOP: "",
    ELECTRON_DOCUMENTS: "",
    ELECTRON_DOWNLOADS: "",
    ELECTRON_EXE: "",
    ELECTRON_HOME: "",
    ELECTRON_LOCAL: "",
    ELECTRON_LOGS: "",
    ELECTRON_TEMP: "",

    APP_DATA: "",
    CLIENT_STATIC: "",
    CLIENT_CACHE: "",
    ROOT_PATH: "",
    PROJECTS_DB: "",
    PROJECT_THUMBNAIL: "",
    RESOURCE: "",
    ASSETS: "",
    BINARY: "",
    RESOURCE_CONFIG_DIR: "",
    RESOURCE_CONFIG_FILE: "",
    AAPT_TOOL: "",
    ADB_TOOL: "",
    PACK_TEMPORARY: "",
    NINEPATCH_TEMPORARY: "",
    WORKERS: {
      ninePatch: ""
    },
    RELEASE_DIRS: {
      main: "",
      renderer: "",
      workers: ""
    }
  };
  static get default(): TypePathCollection {
    return new PathCollection().create();
  }
}
