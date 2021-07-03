import { Element } from "xml-js";
import { xml2jsonElement } from "server/core/xml";
import XMLNodeElement from "./XMLNodeElement";

export default class JsonElementCompiler {
  private file: string;
  private xmlJson?: Element;
  constructor(file: string) {
    this.file = file;
  }

  protected getFile(): string {
    return this.file;
  }

  protected async ensureXmlData(): Promise<Element> {
    if (!this.xmlJson) {
      this.xmlJson = await xml2jsonElement<Element>(this.file);
    }
    return this.xmlJson;
  }

  protected async getRootChildren(): Promise<Element[]> {
    const xmlJson = await this.ensureXmlData();
    const rootElements = new XMLNodeElement(xmlJson)
      .getFirstChild()
      .getChildren();
    return rootElements;
  }
}
