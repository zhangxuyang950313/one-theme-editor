import { TypeBrandConf, TypeBrandInfo } from "../types/project";
import { AbstractDataModel } from "./abstract";

export class BrandInfo extends AbstractDataModel<TypeBrandInfo> {
  data = {
    type: "",
    name: ""
  };

  static default(): TypeBrandInfo {
    return new BrandInfo().default();
  }
}

export class BrandConf extends AbstractDataModel<TypeBrandConf> {
  data = {
    ...BrandInfo.default(),
    sourceConfigs: []
  };

  static default(): TypeBrandConf {
    return new BrandConf().default();
  }
}
