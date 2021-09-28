import {
  TypePackConf,
  TypeApplyConf,
  TypeProjectInfoConf,
  TypeScenarioConf,
  TypeScenarioOption
} from "src/types/source";
import { AbstractDataModel } from "./AbstractDataModel";

// 描述信息模板数据
export class ProjectInfoConfig extends AbstractDataModel<TypeProjectInfoConf> {
  protected data: TypeProjectInfoConf = {
    output: "",
    propsMapper: [],
    template: ""
  };
  static default = new ProjectInfoConfig().create();
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
export default class ScenarioConfig extends AbstractDataModel<TypeScenarioConf> {
  protected data: TypeScenarioConf = {
    name: "",
    md5: "",
    projectInfoConfig: ProjectInfoConfig.default,
    packageConfig: PackageConfig.default,
    applyConfig: ApplyConfig.default
  };
  static default = new ScenarioConfig().create();
}

// 场景配置
export class ScenarioOption extends AbstractDataModel<TypeScenarioOption> {
  protected data: TypeScenarioOption = {
    src: "",
    ...ScenarioConfig.default
  };
  static default = new ScenarioOption().create();
}
