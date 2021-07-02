import { Element } from "xml-js";
import { xml2jsonElements } from "server/compiler/xml";
import XMLNodeElement from "server/core/XMLNodeElements";
import { TypeKeyValMapperConf } from "src/types/source-config";

export default class TempKeyValMapper {
  private file: string;
  private xmlJson?: Element;
  constructor(file: string) {
    this.file = file;
  }

  private async ensureXmlData(): Promise<Element> {
    if (!this.xmlJson) {
      this.xmlJson = await xml2jsonElements<Element>(this.file);
    }
    return this.xmlJson;
  }

  getTemplateValueData() {
    xml2jsonElements(this.file).then(console.log);
  }
  private async getRootChildren(): Promise<Element[]> {
    const xmlJson = await this.ensureXmlData();
    const rootElements = new XMLNodeElement(xmlJson)
      .getFirstChild()
      .getChildren();
    return rootElements;
  }

  async getDataList(): Promise<TypeKeyValMapperConf[]> {
    const rootElements = await this.getRootChildren();
    return rootElements.map(item => {
      const itemNode = new XMLNodeElement(item);
      return {
        key: itemNode.getAttribute("name"),
        value: itemNode.getChildText(),
        description: itemNode.getAttribute("description")
      };
    });
  }

  async getDataMap(): Promise<Map<string, string>> {
    const rootElements = await this.getRootChildren();
    const map = new Map<string, string>();
    rootElements.forEach(item => {
      const itemNode = new XMLNodeElement(item);
      map.set(itemNode.getAttribute("name"), itemNode.getChildText());
    });
    return map;
  }
}
