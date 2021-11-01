import { ElementCompact } from "xml-js";

// 节点处理
export default class XMLNodeCompact {
  private node: ElementCompact;
  constructor(node: ElementCompact) {
    this.node = node;
  }

  // 获取属性所有键
  getAttributeKeys(): string[] {
    return this.node?._attributes ? Object.keys(this.node._attributes) : [];
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
    if (this.node?._attributes && this.node._attributes[attr]) {
      return String(this.node._attributes[attr]);
    }
    return def;
  }

  /**
   * 获取指定子节点列表
   * @param tagname 指定节点
   */
  getChildrenOf(tagname: string): ElementCompact[] {
    return this.node?.[tagname] || [];
  }

  /**
   * 获取指定子节点的第一个节点
   * @param tagname 指定节点
   */
  getFirstChildOf(tagname: string): XMLNodeCompact {
    const firstChild = this.getChildrenOf(tagname)[0];
    return new XMLNodeCompact(firstChild);
  }
}
