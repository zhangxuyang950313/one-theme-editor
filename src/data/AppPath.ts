import { TypePathConfig } from "../types/extraConfig";
import { AbstractDataModel } from "./AbstractDataModel";

export default class AppPath extends AbstractDataModel<TypePathConfig> {
  protected data: TypePathConfig = {
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
    CLIENT_DATA: "",
    CLIENT_STATIC: "",
    CLIENT_CACHE: "",
    EXTRA_DATA_DB: "",
    PROJECTS_DB: "",
    RESOURCE_DIR: "",
    ASSETS_DIR: "",
    BINARY_DIR: "",
    SOURCE_CONFIG_DIR: "",
    SOURCE_CONFIG_FILE: "",
    AAPT_TOOL: "",
    ADB_TOOL: ""
  };
}
