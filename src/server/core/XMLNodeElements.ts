import { Element } from "xml-js";

// 节点处理
export default class XMLNodeElements {
  private node: Element;
  constructor(node: Element) {
    this.node = node;
  }

  // 获取属性所有键
  getAttributeKeys(): string[] {
    return Object.keys(this.node.attributes || {});
  }

  // // 获取属性所有值
  // getAttributeValues(): string[] {
  //   return this.node._attributes
  //     ? Object.values(String(this.node._attributes))
  //     : [];
  // }

  /**
   * 获取节点指定键值
   * @param attr 键
   * @param def 指定默认值
   * @returns
   */
  getAttribute(attr: string, def = ""): string {
    return String((this.node.attributes || {})[attr]) || def;
  }

  getChildren(): Element[] {
    return this.node.elements || [];
  }

  /**
   * 获取子节点的文本节点
   */
  getTextChildren(): string[] {
    return this.getChildren()
      .filter(item => item.type === "text")
      .map(item => String(item.text));
  }

  getTextChild(): string {
    return this.getTextChildren()[0] || "";
  }

  /**
   * 获取子节点列表第一个指定 tagname 子节点
   * @param tagname 指定节点 tagname
   */
  getChildOf(tagname: string): Element {
    return this.getChildren().find(item => item.name === tagname) || {};
  }

  /**
   * 获取指定子节点列表
   * @param tagname 指定节点 tagname
   */
  getChildrenOf(tagname: string): Element[] {
    return this.getChildren().filter(item => item.name === tagname);
  }

  /**
   * 获取指定节点的第一个子节点
   * @param tagname 指定节点
   */
  getFirstChildOf(tagname: string): XMLNodeElements {
    const firstChild = this.getChildOf(tagname)?.elements?.[0];
    if (!firstChild) {
      throw new Error(`节点${tagname}没有子节点`);
    }
    return new XMLNodeElements(firstChild);
  }
}
