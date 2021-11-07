import { TypePathCollection } from "src/types/config.extra";
import { AbstractDataModel } from "./AbstractDataModel";

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
    EXTRA_DATA_DB: "",
    PROJECTS_DB: "",
    PROJECT_THUMBNAIL_DIR: "",
    RESOURCE_DIR: "",
    ASSETS_DIR: "",
    BINARY_DIR: "",
    RESOURCE_CONFIG_DIR: "",
    RESOURCE_CONFIG_FILE: "",
    AAPT_TOOL: "",
    ADB_TOOL: "",
    PACK_TEMPORARY: ""
  };
  static get default(): TypePathCollection {
    return new PathCollection().create();
  }
}
