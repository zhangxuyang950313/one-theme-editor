import md5 from "md5";
import fse from "fs-extra";
import {
  TypeApplyConf,
  TypeScenarioConf,
  TypeScenarioOption,
  TypePackConf
} from "src/types/source";
import { ELEMENT_TAG } from "src/enum/index";
import ScenarioConfig, { ScenarioOption } from "src/data/ScenarioConfig";
import XmlTemplate from "server/compiler/XmlTemplate";
import XmlFileCompiler from "server/compiler/XmlFileCompiler";
import pathUtil from "server/utils/pathUtil";
import ERR_CODE from "src/common/errorCode";
import ScenarioConfigCompiler from "./ScenarioConfig";
import XMLNodeElement from "./XMLNodeElement";

export default class ScenarioOptions extends XmlTemplate {
  // 默认配置路径
  static get def(): ScenarioOptions {
    return ScenarioOptions.from(pathUtil.SOURCE_CONFIG_FILE);
  }

  // 从文件创建实例
  static from(file: string): ScenarioOptions {
    if (!fse.existsSync(file)) {
      throw new Error(ERR_CODE[4003]);
    }
    const element = new XmlFileCompiler(file).getElement();
    return new ScenarioOptions(element);
  }

  // 读取场景配置列表
  static readScenarioOptionList(): TypeScenarioOption[] {
    return ScenarioOptions.def.getOptionList();
  }

  // 读取场景配置数据
  static readScenarioConfList(): TypeScenarioConf[] {
    return ScenarioOptions.def.getScenarioConfList();
  }

  private getScenarioNodes(): XMLNodeElement[] {
    return super.getRootNode().getChildrenNodesByTagname(ELEMENT_TAG.Scenario);
  }

  // 获取场景配置列表
  getScenarioConfList(): TypeScenarioConf[] {
    return this.getOptionList().map(option =>
      new ScenarioConfig()
        .set("name", option.name)
        .set("md5", option.md5)
        .set("projectInfoConfig", option.projectInfoConfig)
        .set("packageConfig", option.packageConfig)
        .set("applyConfig", option.applyConfig)
        .create()
    );
  }

  // 使用 md5 值查找打包配置
  getPackConfigByMd5(md5: string): TypePackConf | null {
    const conf = this.getScenarioConfList().find(item => item.md5 === md5);
    return conf ? conf.packageConfig : null;
  }

  // 使用 md5 值查找应用配置
  getApplyConfigByMd5(md5: string): TypeApplyConf | null {
    const conf = this.getScenarioConfList().find(item => item.md5 === md5);
    return conf ? conf.applyConfig : null;
  }

  getOptionList(): TypeScenarioOption[] {
    return this.getScenarioNodes().map(item => {
      const name = item.getAttributeOf("name");
      const src = item.getAttributeOf("src");
      const scenarioConfig = ScenarioConfigCompiler.from(src);
      const packageConfig = scenarioConfig.getPackageConfig();
      const applyConfig = scenarioConfig.getApplyConfig();
      const projectInfoConfig = scenarioConfig.getProjectInfoConfig();
      return new ScenarioOption()
        .set("src", src)
        .set("name", name)
        .set("md5", md5(name))
        .set("packageConfig", packageConfig)
        .set("applyConfig", applyConfig)
        .set("projectInfoConfig", projectInfoConfig)
        .create();
    });
  }
}
