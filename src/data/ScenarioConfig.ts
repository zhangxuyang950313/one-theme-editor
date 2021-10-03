import {
  TypePackConfig,
  TypeApplyConfig,
  TypeFileTemplateConfig,
  TypeScenarioConfig,
  TypeScenarioOption
} from "src/types/resource";
import { FILE_TEMPLATE_TYPE } from "src/enum";
import { AbstractDataModel } from "./AbstractDataModel";

// 文件模板模板数据
export class FileTemplate extends AbstractDataModel<TypeFileTemplateConfig> {
  protected data: TypeFileTemplateConfig = {
    output: "",
    type: FILE_TEMPLATE_TYPE.UNKNOWN,
    items: [],
    template: ""
  };
  static get default(): TypeFileTemplateConfig {
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

// 场景选项列表配置
export default class ScenarioConfigData extends AbstractDataModel<TypeScenarioConfig> {
  protected data: TypeScenarioConfig = {
    fileTempList: [],
    packageConfig: PackageConfig.default,
    applyConfig: ApplyConfig.default
  };
  static get default(): TypeScenarioConfig {
    return new ScenarioConfigData().create();
  }
}

// 场景配置
export class ScenarioOption extends AbstractDataModel<TypeScenarioOption> {
  protected data: TypeScenarioOption = {
    name: "",
    md5: "",
    src: "",
    ...ScenarioConfigData.default
  };
  static get default(): TypeScenarioOption {
    return new ScenarioOption().create();
  }
}
