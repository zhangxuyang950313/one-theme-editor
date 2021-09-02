import { TypeBrandConf, TypeBrandInfo, TypePackConf } from "src/types/source";
import { AbstractDataModel } from "./AbstractDataModel";

export class PackageConfig extends AbstractDataModel<TypePackConf> {
  protected data: TypePackConf = {
    extname: "",
    format: "zip",
    execute9patch: true,
    items: [],
    excludes: []
  };
}
export class BrandInfo extends AbstractDataModel<TypeBrandInfo> {
  protected data: TypeBrandInfo = {
    name: "",
    md5: ""
  };

  static default(): TypeBrandInfo {
    return new BrandInfo().default();
  }
}

export class BrandConf extends AbstractDataModel<TypeBrandConf> {
  protected data: TypeBrandConf = {
    ...new BrandInfo().create(),
    sourceConfigs: [],
    packageConfig: new PackageConfig().create()
  };

  static default(): TypeBrandConf {
    return new BrandConf().default();
  }
}
