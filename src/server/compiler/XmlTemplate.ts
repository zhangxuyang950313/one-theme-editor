import { TypeXmlTempData } from "types/source-config";
import XMLNodeElement from "./XMLNodeElement";
import JsonElementCompiler from "./JsonElementCompiler";

export default class XmlTemplate extends JsonElementCompiler {
  async getData(): Promise<TypeXmlTempData[]> {
    const rootElements = await super.getRootChildren();
    return rootElements.map(item => {
      const node = new XMLNodeElement(item);
      return {
        name: node.getAttributeOf("name"),
        attribute: node.getAttributes(),
        child: node.getChildText()
      };
    });
  }
}
