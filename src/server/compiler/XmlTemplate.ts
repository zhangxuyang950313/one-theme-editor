import { TypeXmlTempData } from "types/source-config";
import BaseCompiler from "./BaseCompiler";

export default class XmlTemplate extends BaseCompiler {
  async getData(): Promise<TypeXmlTempData[]> {
    return (await super.getRootChildren()).map(node => {
      return {
        name: node.getAttributeOf("name"),
        attribute: node.getAttributes(),
        child: node.getChildText()
      };
    });
  }
}
