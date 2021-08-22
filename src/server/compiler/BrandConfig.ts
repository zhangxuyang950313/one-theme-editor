import { TypeBrandConf } from "types/project";
import { BrandConf } from "src/data/BrandConfig";
import { ELEMENT_TAG } from "src/enum/index";
import XmlTemplate from "./XmlTemplate";

export default class BrandConfig extends XmlTemplate {
  getBrandConfList(): TypeBrandConf[] {
    const brandNodeList = super
      .getRootNode()
      .getChildrenNodesByTagname(ELEMENT_TAG.Brand);
    return brandNodeList.map(brandNode => {
      const sourceConfigs = brandNode
        .getChildrenNodesByTagname(ELEMENT_TAG.Config)
        .map(configNode => configNode.getAttributeOf("src"));
      return new BrandConf()
        .set("name", brandNode.getAttributeOf("name"))
        .set("type", brandNode.getAttributeOf("type"))
        .set("sourceConfigs", sourceConfigs)
        .create();
    });
  }
}
