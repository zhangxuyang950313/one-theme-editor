import path from "path";
import fse from "fs-extra";
import {
  TypeApplyConfig,
  TypeFileTempConfig,
  TypePackConfig,
  TypeScenarioConfig
} from "src/types/config.scenario";
import {
  TypeResourceConfig,
  TypeResourceOption
} from "src/types/config.resource";
import { ELEMENT_TAG, PACK_TYPE } from "src/enum/index";
import ScenarioConfig, {
  ApplyConfig,
  PackageConfig,
  FileTemplate
} from "src/data/ScenarioConfig";
import ResourceConfigCompiler from "src/common/compiler/ResourceConfig";
import pathUtil from "src/common/utils/pathUtil";
import XmlCompilerExtra from "./XmlCompilerExtra";
import XmlCompiler from "./XmlCompiler";

// 解析场景配置
export default class ScenarioConfigCompiler extends XmlCompilerExtra {
  // 从文件创建实例
  static from(src: string): ScenarioConfigCompiler {
    const file = path.join(pathUtil.RESOURCE_CONFIG_DIR, src);
    const element = new XmlCompiler(file).getElement();
    return new ScenarioConfigCompiler(element);
  }

  getName(): string {
    return super.getChildrenFirstElementNode().getAttributeOf("name");
  }

  // 解析描述文件配置
  getFileTempList(): TypeFileTempConfig[] {
    const fileTempNodes = super
      .getChildrenFirstElementNode()
      .getChildrenNodesByTagname(ELEMENT_TAG.FileTemplate);
    return fileTempNodes.map(fileTempNode => {
      const itemsNode = fileTempNode.getChildrenFirstNodeByTagname(
        ELEMENT_TAG.Items
      );
      const templateNode = fileTempNode.getChildrenFirstNodeByTagname(
        ELEMENT_TAG.Template
      );
      const itemNodes: TypeFileTempConfig["items"] = itemsNode
        .getChildrenNodesByTagname(ELEMENT_TAG.Item)
        .map(item => {
          return {
            name: item.getAttributeOf("name"),
            description: item.getAttributeOf("description"),
            disabled: item.getAttributeOf("disabled") === "true",
            visible: item.getAttributeOf("visible") !== "false"
          };
        });
      return new FileTemplate()
        .set("output", fileTempNode.getAttributeOf("output"))
        .set("type", fileTempNode.getAttributeOf("type"))
        .set("items", itemNodes)
        .set("template", templateNode.buildXml())
        .create();
    });
  }

  // 解析打包配置
  getPackageConfig(): TypePackConfig {
    const pkgNode = super
      .getChildrenFirstElementNode()
      .getChildrenFirstNodeByTagname(ELEMENT_TAG.PackConfig);
    const items: TypePackConfig["items"] = pkgNode
      .getChildrenNodesByTagname(ELEMENT_TAG.Item)
      .map(item => ({
        type: item.getAttributeOf<PACK_TYPE>("type"),
        // 匹配模式
        pattern: item.getAttributeOf("pattern"),
        // TODO 若没定义 name 正则取 path root
        // TODO 忘了这是干嘛的，留着以后想
        name: item.getAttributeOf("name")
      }));
    const excludes: TypePackConfig["excludes"] = pkgNode
      .getChildrenNodesByTagname(ELEMENT_TAG.Exclude)
      .map(item => ({
        regex: item.getAttributeOf("regex"),
        pattern: item.getAttributeOf("pattern")
      }));
    const extname = pkgNode.getAttributeOf("extname", "zip");
    const format = pkgNode.getAttributeOf("format", "zip");
    const exec9pt = pkgNode.getAttributeOf("execute9patch", "true") === "true";
    return new PackageConfig()
      .set("items", items)
      .set("excludes", excludes)
      .set("extname", extname)
      .set("format", format)
      .set("execute9patch", exec9pt)
      .create();
  }

  // 解析应用配置
  getApplyConfig(): TypeApplyConfig {
    const applyNode = super
      .getChildrenFirstElementNode()
      .getChildrenFirstNodeByTagname(ELEMENT_TAG.ApplyConfig);
    const steps: TypeApplyConfig["steps"] = applyNode
      .getChildrenNodesByTagname(ELEMENT_TAG.Step)
      .map(item => ({
        description: item.getAttributeOf("description"),
        command: item.getAttributeOf("cmd")
      }));
    return new ApplyConfig().set("steps", steps).create();
  }

  // 解析资源配置路径
  getResourceConfigSrcList(): string[] {
    return super
      .getChildrenFirstElementNode()
      .getChildrenNodesByTagname(ELEMENT_TAG.ResourceConfig)
      .flatMap(node => {
        const src = node.getAttributeOf("src");
        return fse.pathExistsSync(path.join(pathUtil.RESOURCE_CONFIG_DIR, src))
          ? [src]
          : [];
      });
  }

  // 解析编辑器资源选项列表
  getResourceOptionList(): TypeResourceOption[] {
    return this.getResourceConfigSrcList().map(src =>
      ResourceConfigCompiler.from(src).getOption()
    );
  }

  // 解析编辑器资源配置列表
  getResourceConfigList(): TypeResourceConfig[] {
    return this.getResourceConfigSrcList().map(src =>
      ResourceConfigCompiler.from(src).getConfig()
    );
  }

  getConfig(): TypeScenarioConfig {
    const name = this.getName();
    return new ScenarioConfig()
      .set("name", name)
      .set("applyConfig", this.getApplyConfig())
      .set("fileTempList", this.getFileTempList())
      .set("packageConfig", this.getPackageConfig())
      .set("resourceConfigList", this.getResourceConfigList())
      .create();
  }
}
