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
    ELECTRON_LOGS: ""
  };
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
    SOURCE_CONFIG_DIR: "",
    SOURCE_CONFIG_FILE: "",
    AAPT_TOOL: "",
    ADB_TOOL: "",
    PACK_TEMPORARY: ""
  };
}

export default class AppPathCollection extends AbstractDataModel<TypePathConfig> {
  protected data: TypePathConfig = {
    ...new ElectronPathCollection().create(),
    ...new ServerPathCollection().create()
  };
}
