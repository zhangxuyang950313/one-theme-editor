import md5 from "md5";
import { TypeBrandConf, TypePackConf } from "src/types/source";
import { ELEMENT_TAG, PACK_TYPE } from "src/enum/index";
import { PackageConfig } from "src/data/SourceConfig";
import { BrandConf } from "src/data/BrandConfig";
import XmlTemplate from "./XmlTemplate";
import XmlFileCompiler from "./XmlFileCompiler";
import XMLNodeElement from "./XMLNodeElement";

export default class BrandConfig extends XmlTemplate {
  // 从文件创建实例
  static from(file: string): BrandConfig {
    const element = new XmlFileCompiler(file).getElement();
    return new BrandConfig(element);
  }

  getPackageConfigByBrandMd5(brandMd5: string): TypeBrandConf | null {
    const brandConfList = this.getBrandConfList();
    return brandConfList.find(item => item.md5 === brandMd5) || null;
  }

  // 解析打包配置
  getPackageConfigByBrandNode(node: XMLNodeElement): TypePackConf {
    const packageNode = node.getFirstChildNodeByTagname(ELEMENT_TAG.Package);
    const packageConf = new PackageConfig();
    const items: TypePackConf["items"] = packageNode
      .getChildrenNodesByTagname(ELEMENT_TAG.Item)
      .map(item => ({
        type: item.getAttributeOf<PACK_TYPE>("type"),
        path: item.getAttributeOf("path"),
        name: item.getAttributeOf("name") // TODO 若没定义 name 正则取 path root
      }));
    packageConf.set("items", items);
    packageConf.set("extname", packageNode.getAttributeOf("extname", "zip"));
    packageConf.set("format", packageNode.getAttributeOf("format", "zip"));
    return packageConf.create();
  }

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
      return new BrandConf()
        .set("name", name)
        .set("md5", md5(name))
        .set("sourceConfigs", sourceConfigs)
        .set("packageConfig", packageConfig)
        .create();
    });
  }
}
