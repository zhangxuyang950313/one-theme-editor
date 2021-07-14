import { TypeBrandConf, TypeBrandInfo } from "../types/project";

export class DataBrandInfo implements TypeBrandInfo {
  type = "";
  name = "";
}

export class DataBrandConf extends DataBrandInfo implements TypeBrandConf {
  type = "";
  name = "";
  sourceConfigs: string[] = [];
}
