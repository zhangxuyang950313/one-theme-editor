import { TypeProjectUiVersion } from "../types/project";
import {
  TypeSourceConfigData,
  TypeSourceConfigInfo,
  TypeSourceModuleConf,
  TypeSourcePageConf,
  TypeSourcePageGroupConf,
  TypeSourceTypeConf
} from "../types/source-config.d";

export class DataSourcePageConf implements TypeSourcePageConf {
  key = "";
  name = "";
  preview = "";
  src = "";
}

export class DataSourcePageGroupConf implements TypeSourcePageGroupConf {
  name = "";
  pageList: DataSourcePageConf[] = [];
}

export class DataSourceModuleConf implements TypeSourceModuleConf {
  index = 0;
  name = "";
  icon = "";
  groupList: TypeSourcePageGroupConf[] = [];
}

export class DataSourceTypeConf implements TypeSourceTypeConf {
  tag = "";
  name = "";
  type: TypeSourceTypeConf["type"];
  constructor(type: TypeSourceTypeConf["type"]) {
    this.type = type;
  }
}

export class DataUiVersion implements TypeProjectUiVersion {
  name = "";
  code = "";
}

export class DataSourceConfigInfo implements TypeSourceConfigInfo {
  key = "";
  url = "";
  name = "";
  preview = "";
  version = "";
  uiVersion = new DataUiVersion();
}

export class DataSourceConfig
  extends DataSourceConfigInfo
  implements TypeSourceConfigData
{
  sourceTypeList: DataSourceTypeConf[] = [];
  moduleList: DataSourceModuleConf[] = [];
}
