import {
  TypeElectronPath,
  TypePathConfig,
  TypeServerPath
} from "src/types/extraConfig";
import { AbstractDataModel } from "./AbstractDataModel";

export class ElectronPathCollection extends AbstractDataModel<TypeElectronPath> {
  protected data: TypeElectronPath = {
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
    ELECTRON_TEMP: ""
  };
  static get default(): TypeElectronPath {
    return new ElectronPathCollection().create();
  }
}

export class ServerPathCollection extends AbstractDataModel<TypeServerPath> {
  protected data: TypeServerPath = {
    CLIENT_DATA: "",
    CLIENT_STATIC: "",
    CLIENT_CACHE: "",
    EXTRA_DATA_DB: "",
    PROJECTS_DB: "",
    RESOURCE_DIR: "",
    ASSETS_DIR: "",
    BINARY_DIR: "",
    RESOURCE_CONFIG_DIR: "",
    RESOURCE_CONFIG_FILE: "",
    AAPT_TOOL: "",
    ADB_TOOL: "",
    PACK_TEMPORARY: ""
  };
  static get default(): TypeServerPath {
    return new ServerPathCollection().create();
  }
}

export default class PathCollection extends AbstractDataModel<TypePathConfig> {
  protected data: TypePathConfig = {
    ...new ElectronPathCollection().create(),
    ...new ServerPathCollection().create()
  };
  static get default(): TypePathConfig {
    return new PathCollection().create();
  }
}
