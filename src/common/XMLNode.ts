import { ElementCompact } from "xml-js";

// 节点处理
export default class XMLNode {
  private node: ElementCompact;
  constructor(node: ElementCompact) {
    this.node = node;
  }

  // 获取属性所有键
  getAttributeKeys(): string[] {
    return this.node._attributes ? Object.keys(this.node._attributes) : [];
  }

  // // 获取属性所有值
  // getAttributeValues(): string[] {
  //   return this.node._attributes
  //     ? Object.values(String(this.node._attributes))
  //     : [];
  // }

  // 根据键获得值
  getAttribute(attr: string): string {
    return this.node._attributes
      ? String(this.node._attributes[attr]) ?? ""
      : "";
  }
}
