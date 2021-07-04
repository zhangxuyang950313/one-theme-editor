import { Element } from "xml-js";
import { TypeSCPageXmlTempData } from "types/source-config";
import BaseCompiler from "./BaseCompiler";

export default class XmlTemplate extends BaseCompiler {
  getData(): TypeSCPageXmlTempData[] {
    return super.getRootChildren().map(node => ({
      name: node.getAttributeOf("name"),
      attribute: node.getAttributes(),
      child: node.getFirstTextChildValue()
    }));
  }
  public getElementList(): Element[] {
    return super.getRootChildren().map(item => item.getElement());
  }
}
