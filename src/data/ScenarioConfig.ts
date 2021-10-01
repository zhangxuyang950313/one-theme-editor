import {
  TypePackConf,
  TypeApplyConf,
  TypeFileTemplateConf,
  TypeScenarioConfig,
  TypeScenarioOption
} from "src/types/resource";
import { FILE_TEMPLATE_TYPE } from "src/enum";
import { AbstractDataModel } from "./AbstractDataModel";

// 文件模板模板数据
export class FileTemplate extends AbstractDataModel<TypeFileTemplateConf> {
  protected data: TypeFileTemplateConf = {
    output: "",
    type: FILE_TEMPLATE_TYPE.UNKNOWN,
    items: [],
    template: ""
  };
  static default = new FileTemplate().create();
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

// 场景选项列表配置
export default class ScenarioConfigData extends AbstractDataModel<TypeScenarioConfig> {
  protected data: TypeScenarioConfig = {
    fileTempList: [],
    packageConfig: PackageConfig.default,
    applyConfig: ApplyConfig.default
  };
  static default = new ScenarioConfigData().create();
}

// 场景配置
export class ScenarioOption extends AbstractDataModel<TypeScenarioOption> {
  protected data: TypeScenarioOption = {
    name: "",
    md5: "",
    src: "",
    ...ScenarioConfigData.default
  };
  static default = new ScenarioOption().create();
}
