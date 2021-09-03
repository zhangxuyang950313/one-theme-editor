import md5 from "md5";
import { TypeBrandConf, TypePackConf, TypeApplyConf } from "src/types/source";
import { ELEMENT_TAG, PACK_TYPE } from "src/enum/index";
import { ApplyConfig, BrandConf, PackageConfig } from "src/data/BrandConfig";
import XmlTemplate from "./XmlTemplate";
import XmlFileCompiler from "./XmlFileCompiler";
import XMLNodeElement from "./XMLNodeElement";

export default class BrandConfig extends XmlTemplate {
  // 从文件创建实例
  static from(file: string): BrandConfig {
    const element = new XmlFileCompiler(file).getElement();
    return new BrandConfig(element);
  }

  // 解析打包配置
  getPackageConfigByBrandNode(node: XMLNodeElement): TypePackConf {
    const pkgNode = node.getFirstChildNodeByTagname(ELEMENT_TAG.Package);
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

  getApplyConfigByBrandNode(node: XMLNodeElement): TypeApplyConf {
    const applyNode = node.getFirstChildNodeByTagname(ELEMENT_TAG.Apply);
    const steps: TypeApplyConf["steps"] = applyNode
      .getChildrenNodesByTagname(ELEMENT_TAG.Step)
      .map(item => ({
        description: item.getAttributeOf("description"),
        command: item.getAttributeOf("cmd")
      }));
    return new ApplyConfig().set("steps", steps).create();
  }

  // 获取厂商配置列表
  getBrandConfList(): TypeBrandConf[] {
    const brandNodeList = super
      .getRootNode()
      .getChildrenNodesByTagname(ELEMENT_TAG.Brand);
    return brandNodeList.map(brandNode => {
      const sourceConfigs = brandNode
        .getChildrenNodesByTagname(ELEMENT_TAG.Config)
        .map(configNode => configNode.getAttributeOf("src"));
      const name = brandNode.getAttributeOf("name");
      const packageConfig = this.getPackageConfigByBrandNode(brandNode);
      const applyConfig = this.getApplyConfigByBrandNode(brandNode);
      return new BrandConf()
        .set("name", name)
        .set("md5", md5(name))
        .set("sourceConfigs", sourceConfigs)
        .set("packageConfig", packageConfig)
        .set("applyConfig", applyConfig)
        .create();
    });
  }

  // 使用 brandName 的 md5 值查找打包配置
  getPackageConfigByBrandMd5(md5: string): TypePackConf | null {
    const brandConf = this.getBrandConfList().find(item => item.md5 === md5);
    return brandConf ? brandConf.packageConfig : null;
  }

  // 使用 brandName 的 md5 值查找应用配置
  getApplyConfigByBrandMd5(md5: string): TypeApplyConf | null {
    const brandConf = this.getBrandConfList().find(item => item.md5 === md5);
    return brandConf ? brandConf.applyConfig : null;
  }
}
