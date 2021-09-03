import {
  TypeBrandConf,
  TypePackConf,
  TypeApplyConf,
  TypeInfoTempConf,
  TypeBrandOption
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

// 厂商选项列表配置
export class BrandOption extends AbstractDataModel<TypeBrandOption> {
  protected data: TypeBrandOption = {
    name: "",
    md5: "",
    src: "",
    infoTemplate: new InfoTemplate().create(),
    packageConfig: new PackageConfig().create(),
    applyConfig: new ApplyConfig().create()
  };
}

// 厂商配置
export class BrandConf extends AbstractDataModel<TypeBrandConf> {
  protected data: TypeBrandConf = {
    ...new BrandOption().create(),
    sourceConfigs: []
  };

  static default(): TypeBrandConf {
    return new BrandConf().default();
  }
}
