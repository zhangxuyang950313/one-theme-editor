import { TypeProjectDataDoc, TypeProjectInfo } from "../types/project.d";
import { DataBrandInfo } from "./DataBrandConfig";
import { DataUiVersion } from "./DataSourceConfig";

export class DataProjectInfo implements TypeProjectInfo {
  [k: string]: string;
}

export class DataProjectData implements TypeProjectDataDoc {
  uuid = "";
  brandInfo = new DataBrandInfo();
  projectPathname = "";
  projectInfo = new DataProjectInfo();
  uiVersion = new DataUiVersion();
  sourceConfigUrl = "";
  _id = "";
  createdAt?: Date = new Date();
  updatedAt?: Date = new Date();
}
