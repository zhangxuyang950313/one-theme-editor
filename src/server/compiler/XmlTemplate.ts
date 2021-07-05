import { Element } from "xml-js";
import BaseCompiler from "./BaseCompiler";

export default class XmlTemplate extends BaseCompiler {
  getData(): string[] {
    return [];
    // return super.getRootChildren().map(node => ({
    //   name: node.getAttributeOf("name"),
    //   attribute: node.getAttributes(),
    //   child: node.getFirstTextChildValue()
    // }));
  }
  public getElementList(): Element[] {
    return super.getRootChildren().map(item => item.getElement());
  }
}
