import { TypeBrandConf, TypeBrandInfo } from "../types/project";
import { AbstractDataModel } from "./AbstractDataModel";

export class BrandInfo extends AbstractDataModel<TypeBrandInfo> {
  protected data: TypeBrandInfo = {
    type: "",
    name: ""
  };

  static default(): TypeBrandInfo {
    return new BrandInfo().default();
  }
}

export class BrandConf extends AbstractDataModel<TypeBrandConf> {
  protected data: TypeBrandConf = {
    ...new BrandInfo().create(),
    sourceConfigs: []
  };

  static default(): TypeBrandConf {
    return new BrandConf().default();
  }
}
