import { Element } from "xml-js";
import { TypeSCPageXmlTempData } from "types/source-config";
import BaseCompiler from "./BaseCompiler";

export default class XmlTemplate extends BaseCompiler {
  async getData(): Promise<TypeSCPageXmlTempData[]> {
    return (await super.getRootChildren()).map(node => {
      return {
        name: node.getAttributeOf("name"),
        attribute: node.getAttributes(),
        child: node.getFirstTextChildValue()
      };
    });
  }
  public async getElementList(): Promise<Element[]> {
    return (await super.getRootChildren()).map(item => item.getElement());
  }
}
