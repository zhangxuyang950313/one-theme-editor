import {
  TypeSourceConfigData,
  TypeSourceModuleConf,
  TypeSourceTypeConf
} from "./../types/source-config.d";
import UiVersion from "./UiVersion";

export default class SourceConfig implements TypeSourceConfigData {
  url = "";
  name = "";
  preview = "";
  version = "";
  uiVersion = new UiVersion();
  sourceTypeList: TypeSourceTypeConf[];
  moduleList: TypeSourceModuleConf[];
}
