import fse from "fs-extra";
import { ELEMENT_TAG } from "src/enum/index";
import { TypeScenarioOption } from "src/types/config.scenario";
import ScenarioConfigCompiler from "src/common/compiler/ScenarioConfig";
import XmlCompilerExtra from "src/common/compiler/XmlCompilerExtra";
import XmlCompiler from "src/common/compiler/XmlCompiler";
import pathUtil from "src/common/utils/pathUtil";
import ERR_CODE from "src/common/errorCode";
import ScenarioOption from "src/data/ScenarioOption";
import XMLNodeElement from "./XMLNodeElement";

export default class ScenarioOptionCompiler extends XmlCompilerExtra {
  // 默认配置路径
  static get def(): ScenarioOptionCompiler {
    return ScenarioOptionCompiler.from(pathUtil.RESOURCE_CONFIG_FILE);
  }

  // 从文件创建实例
  static from(file: string): ScenarioOptionCompiler {
    if (!fse.existsSync(file)) {
      throw new Error(ERR_CODE[4003]);
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
