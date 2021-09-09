import path from "path";
import fse from "fs-extra";
import {
  TypeApplyConf,
  TypeInfoTempConf,
  TypePackConf,
  TypeSourceOption
} from "src/types/source";
import { ELEMENT_TAG, PACK_TYPE } from "src/enum/index";
import { ApplyConfig, PackageConfig } from "src/data/BrandConfig";
import SourceConfig from "server/compiler/SourceConfig";
import pathUtil from "server/utils/pathUtil";
import XmlTemplate from "./XmlTemplate";
import XmlFileCompiler from "./XmlFileCompiler";

export default class BrandConfig extends XmlTemplate {
  // 从文件创建实例
  static from(src: string): BrandConfig {
    const file = path.join(pathUtil.SOURCE_CONFIG_DIR, src);
    const element = new XmlFileCompiler(file).getElement();
    return new BrandConfig(element);
  }

  // 解析描述文件模板
  getInfoTemplate(): TypeInfoTempConf {
    const infoTempNode = super
      .getRootNode()
      .getFirstChildNodeByTagname(ELEMENT_TAG.InfoTemplate);
    return {
      file: infoTempNode.getAttributeOf("file"),
      content: infoTempNode.buildXml()
    };
  }

  // 解析打包配置
  getPackageConfig(): TypePackConf {
    const pkgNode = super
      .getRootNode()
      .getFirstChildNodeByTagname(ELEMENT_TAG.Package);
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
      .getFirstChildNodeByTagname(ELEMENT_TAG.Apply);
    const steps: TypeApplyConf["steps"] = applyNode
      .getChildrenNodesByTagname(ELEMENT_TAG.Step)
      .map(item => ({
        description: item.getAttributeOf("description"),
        command: item.getAttributeOf("cmd")
      }));
    return new ApplyConfig().set("steps", steps).create();
  }

  // 解析编辑器资源配置列表
  getSourceConfigPreviewList(): TypeSourceOption[] {
    return super
      .getRootNode()
      .getChildrenNodesByTagname(ELEMENT_TAG.Config)
      .flatMap(brandNode => {
        const src = brandNode.getAttributeOf("src");
        const isExists = fse.pathExistsSync(
          path.join(pathUtil.SOURCE_CONFIG_DIR, src)
        );
        return isExists ? [new SourceConfig(src).getOption()] : [];
      });
  }
}
