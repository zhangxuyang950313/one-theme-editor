import {
  TypePackConfig,
  TypeApplyConfig,
  TypeFileTempConfig,
  TypeScenarioConfig,
  TypeScenarioOption
} from "src/types/scenario.config";
import { FILE_TEMPLATE_TYPE } from "src/enum";
import { AbstractDataModel } from "./AbstractDataModel";

// 文件模板模板数据
export class FileTemplate extends AbstractDataModel<TypeFileTempConfig> {
  protected data: TypeFileTempConfig = {
    output: "",
    type: FILE_TEMPLATE_TYPE.UNKNOWN,
    items: [],
    template: ""
  };
  static get default(): TypeFileTempConfig {
    return new FileTemplate().create();
  }
}

// 打包配置数据
export class PackageConfig extends AbstractDataModel<TypePackConfig> {
  protected data: TypePackConfig = {
    extname: "",
    format: "zip",
    execute9patch: true,
    items: [],
    excludes: []
  };
  static get default(): TypePackConfig {
    return new PackageConfig().create();
  }
}

// 应用配置数据
export class ApplyConfig extends AbstractDataModel<TypeApplyConfig> {
  protected data: TypeApplyConfig = {
    steps: []
  };
  static get default(): TypeApplyConfig {
    return new ApplyConfig().create();
  }
}

// 场景配置
export default class ScenarioConfig extends AbstractDataModel<TypeScenarioConfig> {
  protected data: TypeScenarioConfig = {
    name: "",
    fileTempList: [],
    packageConfig: PackageConfig.default,
    applyConfig: ApplyConfig.default,
    resourceConfigList: []
  };
  static get default(): TypeScenarioConfig {
    return new ScenarioConfig().create();
  }
}
