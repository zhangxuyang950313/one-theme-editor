import { Element } from "xml-js";
import { TypeKeyValMapperConf } from "types/source-config";
import { xml2jsonElement } from "../core/xml";
import XMLNodeElement from "./XMLNodeElement";
import JsonElementCompiler from "./JsonElementCompiler";

export default class TempKeyValMapper extends JsonElementCompiler {
  getTemplateValueData() {
    xml2jsonElement(super.getFile()).then(console.log);
  }

  async getDataList(): Promise<TypeKeyValMapperConf[]> {
    const rootElements = await super.getRootChildren();
    return rootElements.map(item => {
      const itemNode = new XMLNodeElement(item);
      return {
        key: itemNode.getAttributeOf("name"),
        value: itemNode.getChildText(),
        description: itemNode.getAttributeOf("description")
      };
    });
  }

  async getDataMap(): Promise<Map<string, string>> {
    const rootElements = await super.getRootChildren();
    const map = new Map<string, string>();
    rootElements.forEach(item => {
      const itemNode = new XMLNodeElement(item);
      map.set(itemNode.getAttributeOf("name"), itemNode.getChildText());
    });
    return map;
  }
}
