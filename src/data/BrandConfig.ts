import {
  TypePackConf,
  TypeApplyConf,
  TypeInfoTempConf,
  TypeBrandConf
} from "src/types/source";
import { AbstractDataModel } from "./AbstractDataModel";

// 描述信息模板数据
export class InfoTemplate extends AbstractDataModel<TypeInfoTempConf> {
  protected data: TypeInfoTempConf = {
    file: "",
    content: ""
  };
  static default = new InfoTemplate().create();
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
  static default = new PackageConfig().create();
}

// 应用配置数据
export class ApplyConfig extends AbstractDataModel<TypeApplyConf> {
  protected data: TypeApplyConf = {
    steps: []
  };
  static default = new ApplyConfig().create();
}

// 品牌选项列表配置
export default class BrandConf extends AbstractDataModel<TypeBrandConf> {
  protected data: TypeBrandConf = {
    name: "",
    md5: "",
    infoTemplate: InfoTemplate.default,
    packageConfig: PackageConfig.default,
    applyConfig: ApplyConfig.default
  };
  static default = new BrandConf().create();
}
