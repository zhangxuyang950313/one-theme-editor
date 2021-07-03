import { TypeKeyValMapperConf } from "types/source-config";
import { xml2jsonElement } from "../core/xml";
import BaseCompiler from "./BaseCompiler";

export default class TempKeyValMapper extends BaseCompiler {
  getTemplateValueData(): void {
    xml2jsonElement(super.getFile()).then(console.log);
  }

  async getDataList(): Promise<TypeKeyValMapperConf[]> {
    return (await super.getRootChildren()).map(item => {
      return {
        key: item.getAttributeOf("name"),
        value: item.getChildText(),
        description: item.getAttributeOf("description")
      };
    });
  }

  async getDataMap(): Promise<Map<string, string>> {
    const rootNodes = await super.getRootChildren();
    const map = new Map<string, string>();
    rootNodes.forEach(item => {
      map.set(item.getAttributeOf("name"), item.getChildText());
    });
    return map;
  }
}
