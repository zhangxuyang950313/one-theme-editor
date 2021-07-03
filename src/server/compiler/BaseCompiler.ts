import { Element } from "xml-js";
import { xml2jsonElement } from "server/core/xml";
import XMLNodeElement from "./XMLNodeElement";

export default class BaseCompiler {
  private file: string;
  private xmlJson?: Element;
  constructor(file: string) {
    this.file = file;
  }

  protected async getXmlData(): Promise<Element> {
    if (!this.xmlJson) {
      this.xmlJson = await xml2jsonElement<Element>(this.file);
    }
    return this.xmlJson;
  }

  protected getFile(): string {
    return this.file;
  }

  /**
   * 以第一个节点作为根节点
   * @returns 返回这个节点的 node 实例
   */
  protected async getRootNode(): Promise<XMLNodeElement> {
    const xmlJson = await this.getXmlData();
    return new XMLNodeElement(xmlJson).getFirstChild();
  }

  /**
   * 获取根节点的子节点实例列表
   * @returns
   */
  protected async getRootChildren(): Promise<XMLNodeElement[]> {
    return (await this.getRootNode()).getChildren();
  }

  /**
   * 获取根节点的第一个 {tagname} 节点
   * @param tagname
   * @returns
   */
  protected async getRootFirstChildOf(
    tagname: string
  ): Promise<XMLNodeElement> {
    return (await this.getRootNode()).getFirstChildOf(tagname);
  }

  /**
   * 获取根节点所有 {tagname} 节点
   * @param tagname
   * @returns
   */
  protected async getRootChildrenOf(
    tagname: string
  ): Promise<XMLNodeElement[]> {
    return (await this.getRootNode()).getChildrenOf(tagname);
  }
}
