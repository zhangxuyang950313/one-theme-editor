import md5 from "md5";
import { TypeBrandConf } from "src/types/project";
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
      const name = brandNode.getAttributeOf("name");
      return new BrandConf()
        .set("name", name)
        .set("md5", md5(name))
        .set("sourceConfigs", sourceConfigs)
        .create();
    });
  }
}
