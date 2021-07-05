import { Element } from "xml-js";
import { xml2jsonElement } from "server/core/xml";
import XMLNodeElement from "./XMLNodeElement";

export default class BaseCompiler extends XMLNodeElement {
  private file: string;
  constructor(file: string) {
    super(xml2jsonElement<Element>(file));
    this.file = file;
  }

  protected getFile(): string {
    return this.file;
  }

  /**
   * 以第一个节点作为根节点
   * @returns 返回这个节点的 node 实例
   */
  protected getRootNode(): XMLNodeElement {
    return super.getFirstChild();
  }

  /**
   * 获取根节点的子节点实例列表
   * @returns
   */
  protected getRootChildren(): XMLNodeElement[] {
    return this.getRootNode().getChildren();
  }

  /**
   * 获取根节点的第一个 {tagname} 节点
   * @param tagname
   * @returns
   */
  protected getRootFirstChildOf(tagname: string): XMLNodeElement {
    return this.getRootNode().getFirstChildOf(tagname);
  }

  /**
   * 获取根节点所有 {tagname} 节点
   * @param tagname
   * @returns
   */
  protected getRootChildrenOf(tagname: string): XMLNodeElement[] {
    return this.getRootNode().getChildrenOf(tagname);
  }
}
