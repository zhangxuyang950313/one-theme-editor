import md5 from "md5";
import fse from "fs-extra";
import {
  TypeApplyConfig,
  TypeScenarioConfig,
  TypeScenarioOption,
  TypePackConfig
} from "src/types/scenario.config";
import { ELEMENT_TAG } from "src/enum/index";
import ScenarioConfigData, { ScenarioOption } from "src/data/ScenarioConfig";
import ScenarioConfigCompiler from "src/common/compiler/ScenarioConfig";
import XmlCompilerExtra from "src/common/compiler/XmlCompilerExtra";
import XmlFileCompiler from "src/common/compiler/XmlFileCompiler";
import pathUtil from "src/common/utils/pathUtil";
import ERR_CODE from "src/common/errorCode";
import XMLNodeElement from "./XMLNodeElement";

export default class ScenarioOptions extends XmlCompilerExtra {
  // 默认配置路径
  static get def(): ScenarioOptions {
    return ScenarioOptions.from(pathUtil.RESOURCE_CONFIG_FILE);
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
  static readScenarioConfigList(): TypeScenarioConfig[] {
    return ScenarioOptions.def.getScenarioConfigList();
  }

  private getScenarioNodes(): XMLNodeElement[] {
    return super
      .getChildrenFirstElementNode()
      .getChildrenNodesByTagname(ELEMENT_TAG.Scenario);
  }

  // 获取场景配置列表
  getScenarioConfigList(): TypeScenarioConfig[] {
    return this.getOptionList().map(option => {
      const scenarioConfig = ScenarioConfigCompiler.from(
        option.src
      ).getConfig();
      return new ScenarioConfigData()
        .set("fileTempList", scenarioConfig.fileTempList)
        .set("packageConfig", scenarioConfig.packageConfig)
        .set("applyConfig", scenarioConfig.applyConfig)
        .create();
    });
  }

  // 使用 md5 值查找打包配置
  getPackConfigByMd5(md5: string): TypePackConfig | null {
    const conf = this.getOptionList().find(item => item.md5 === md5);
    return conf
      ? ScenarioConfigCompiler.from(conf.src).getPackageConfig()
      : null;
  }

  // 使用 src 查找打包配置
  getPackConfigBySrc(src: string): TypePackConfig | null {
    const conf = this.getOptionList().find(item => item.src === src);
    return conf
      ? ScenarioConfigCompiler.from(conf.src).getPackageConfig()
      : null;
  }

  // 使用 md5 值查找应用配置
  getApplyConfigByMd5(md5: string): TypeApplyConfig | null {
    const conf = this.getOptionList().find(item => item.md5 === md5);
    return conf ? ScenarioConfigCompiler.from(conf.src).getApplyConfig() : null;
  }

  getOptionList(): TypeScenarioOption[] {
    return this.getScenarioNodes().map(item => {
      const name = item.getAttributeOf("name");
      const src = item.getAttributeOf("src");
      const scenarioConfig = ScenarioConfigCompiler.from(src);
      const packageConfig = scenarioConfig.getPackageConfig();
      const applyConfig = scenarioConfig.getApplyConfig();
      const fileTemp = scenarioConfig.getFileTempList();
      return new ScenarioOption()
        .set("src", src)
        .set("name", name)
        .set("md5", md5(name))
        .set("packageConfig", packageConfig)
        .set("applyConfig", applyConfig)
        .set("fileTempList", fileTemp)
        .create();
    });
  }

  getOption(src: string): TypeScenarioOption {
    const scenarioNode = this.getScenarioNodes().find(
      item => item.getAttributeOf("src") === src
    );
    if (!scenarioNode) return ScenarioOption.default;
    const name = scenarioNode.getAttributeOf("name");
    const scenarioConfig = ScenarioConfigCompiler.from(src);
    const packageConfig = scenarioConfig.getPackageConfig();
    const applyConfig = scenarioConfig.getApplyConfig();
    const fileTemp = scenarioConfig.getFileTempList();
    return new ScenarioOption()
      .set("src", src)
      .set("name", name)
      .set("md5", md5(name))
      .set("packageConfig", packageConfig)
      .set("applyConfig", applyConfig)
      .set("fileTempList", fileTemp)
      .create();
  }
}
