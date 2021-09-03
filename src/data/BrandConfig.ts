import {
  TypeBrandConf,
  TypeBrandInfo,
  TypePackConf,
  TypeApplyConf,
  TypeInfoTempConf
} from "src/types/source";
import { AbstractDataModel } from "./AbstractDataModel";

// 描述信息模板数据
export class InfoTemplate extends AbstractDataModel<TypeInfoTempConf> {
  protected data: TypeInfoTempConf = {
    file: "",
    content: ""
  };
}

// 打包配置数据
export class PackageConfig extends AbstractDataModel<TypePackConf> {
  protected data: TypePackConf = {
    extname: "",
    format: "zip",
    execute9patch: true,
    items: [],
    excludes: []
  };
}

// 应用配置数据
export class ApplyConfig extends AbstractDataModel<TypeApplyConf> {
  protected data: TypeApplyConf = {
    steps: []
  };
}
export class BrandInfo extends AbstractDataModel<TypeBrandInfo> {
  protected data: TypeBrandInfo = {
    name: "",
    md5: "",
    infoTemplate: new InfoTemplate().create(),
    packageConfig: new PackageConfig().create(),
    applyConfig: new ApplyConfig().create()
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
