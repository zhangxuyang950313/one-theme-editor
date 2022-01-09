import fse from "fs-extra";
import { ELEMENT_TAG } from "src/common/enums/index";

import PathUtil from "src/common/utils/PathUtil";
import ScenarioOption from "src/data/ScenarioOption";

import ScenarioConfigCompiler from "./ScenarioConfigCompiler";
import XmlCompilerExtra from "./XmlCompilerExtra";
import XmlCompiler from "./XmlCompiler";
import XMLNodeElement from "./XMLNodeElement";

import type { TypeScenarioOption } from "src/types/config.scenario";

export default class ScenarioOptionCompiler extends XmlCompilerExtra {
  // 默认配置路径
  static get def(): ScenarioOptionCompiler {
    return ScenarioOptionCompiler.from(PathUtil.RESOURCE_CONFIG_FILE);
  }

  // 从文件创建实例
  static from(file: string): ScenarioOptionCompiler {
    if (!fse.existsSync(file)) {
      throw new Error(`场景配置文件不存在: ${file}`);
    }
    const element = new XmlCompiler(file).getElement();
    return new ScenarioOptionCompiler(element);
  }

  private getScenarioNodes(): XMLNodeElement[] {
    return super
      .getChildrenFirstElementNode()
      .getChildrenNodesByTagname(ELEMENT_TAG.Scenario);
  }

  getScenarioSrcList(): string[] {
    return this.getScenarioNodes().map(node => node.getAttributeOf("src"));
  }

  // 获取场景选项列表
  getScenarioOptionList(): TypeScenarioOption[] {
    return this.getScenarioSrcList().map(src => {
      const scenarioConfig = ScenarioConfigCompiler.from(src);
      return new ScenarioOption()
        .set("src", src)
        .set("name", scenarioConfig.getName())
        .set("applyConfig", scenarioConfig.getApplyConfig())
        .set("fileTempList", scenarioConfig.getFileTempList())
        .set("packageConfig", scenarioConfig.getPackageConfig())
        .set("resourceConfigList", scenarioConfig.getResourceConfigList())
        .create();
    });
  }
}
