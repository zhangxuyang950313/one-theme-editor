import path from "path";
import fse from "fs-extra";
import {
  TypeApplyConf,
  TypeFileTemplateConf,
  TypePackConf,
  TypeResourceOption,
  TypeScenarioConfig
} from "src/types/resource";
import { ELEMENT_TAG, PACK_TYPE } from "src/enum/index";
import ScenarioConfigData, {
  ApplyConfig,
  PackageConfig,
  FileTemplate
} from "src/data/ScenarioConfig";
import ResourceConfig from "server/compiler/ResourceConfig";
import pathUtil from "server/utils/pathUtil";
import XmlTemplate from "./XmlTemplate";
import XmlFileCompiler from "./XmlFileCompiler";

// 解析场景配置
export default class ScenarioConfig extends XmlTemplate {
  // 从文件创建实例
  static from(src: string): ScenarioConfig {
    const file = path.join(pathUtil.RESOURCE_CONFIG_DIR, src);
    const element = new XmlFileCompiler(file).getElement();
    return new ScenarioConfig(element);
  }

  // 解析描述文件配置
  getFileTempList(): TypeFileTemplateConf[] {
    const fileTempNodes = super
      .getRootNode()
      .getChildrenNodesByTagname(ELEMENT_TAG.FileTemplate);
    return fileTempNodes.map(fileTempNode => {
      const itemsNode = fileTempNode.getFirstChildNodeByTagname(
        ELEMENT_TAG.Items
      );
      const templateNode = fileTempNode.getFirstChildNodeByTagname(
        ELEMENT_TAG.Template
      );
      const itemNodes: TypeFileTemplateConf["items"] = itemsNode
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
  getPackageConfig(): TypePackConf {
    const pkgNode = super
      .getRootNode()
      .getFirstChildNodeByTagname(ELEMENT_TAG.PackConfig);
    const items: TypePackConf["items"] = pkgNode
      .getChildrenNodesByTagname(ELEMENT_TAG.Item)
      .map(item => ({
        type: item.getAttributeOf<PACK_TYPE>("type"),
        // 匹配模式
        pattern: item.getAttributeOf("pattern"),
        // TODO 若没定义 name 正则取 path root
        // TODO 忘了这是干嘛的，留着以后想
        name: item.getAttributeOf("name")
      }));
    const excludes: TypePackConf["excludes"] = pkgNode
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
  getApplyConfig(): TypeApplyConf {
    const applyNode = super
      .getRootNode()
      .getFirstChildNodeByTagname(ELEMENT_TAG.ApplyConfig);
    const steps: TypeApplyConf["steps"] = applyNode
      .getChildrenNodesByTagname(ELEMENT_TAG.Step)
      .map(item => ({
        description: item.getAttributeOf("description"),
        command: item.getAttributeOf("cmd")
      }));
    return new ApplyConfig().set("steps", steps).create();
  }

  // 解析编辑器资源配置列表
  getResourceOptionList(): TypeResourceOption[] {
    return super
      .getRootNode()
      .getChildrenNodesByTagname(ELEMENT_TAG.ResourceConfig)
      .flatMap(node => {
        const src = node.getAttributeOf("src");
        const isExists = fse.pathExistsSync(
          path.join(pathUtil.RESOURCE_CONFIG_DIR, src)
        );
        return isExists ? [new ResourceConfig(src).getOption()] : [];
      });
  }

  getConfig(): TypeScenarioConfig {
    return new ScenarioConfigData()
      .set("applyConfig", this.getApplyConfig())
      .set("fileTempList", this.getFileTempList())
      .set("packageConfig", this.getPackageConfig())
      .create();
  }
}
