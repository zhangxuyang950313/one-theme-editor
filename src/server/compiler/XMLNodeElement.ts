import { Element, Attributes } from "xml-js";
import { ELEMENT_TYPES } from "src/enum/index";

// 节点处理
export default class XMLNodeElement {
  private node: Element;
  constructor(node: Element) {
    this.node = node;
  }

  // 静态创建节点实例
  static createInstance(node: Element): XMLNodeElement {
    return new XMLNodeElement(node);
  }

  // 静态创建一个空的节点实例
  static createEmptyNode(): XMLNodeElement {
    return new XMLNodeElement({});
  }

  // 节点类型
  // TODO：枚举所有类型
  getType(): ELEMENT_TYPES | string {
    return this.node.type || "";
  }

  // 标签名
  getTagname(): string {
    return this.node.name || "";
  }

  // 获取子节点
  getElements(): Element[] {
    return this.node.elements || [];
  }

  // 如果 getType 是 text，这里会获得节点的文本信息
  getText(): string | number | boolean {
    return this.node.text || "";
  }

  // 获取属性所有键
  getAttributeKeys(): string[] {
    return Object.keys(this.node.attributes || {});
  }

  // 获取属性所有值
  getAttributeValues(): string[] {
    return this.node.attributes
      ? Object.values(String(this.node.attributes))
      : [];
  }

  // 获取所有键值映射
  getAttributes(): Attributes {
    return this.node.attributes || {};
  }

  /**
   * 获取节点指定键值
   * @param attr 键
   * @param def 指定默认值
   * @returns
   */
  getAttributeOf(attr: string, def = ""): string {
    return String((this.node.attributes || {})[attr] || def);
  }

  getChildren(): XMLNodeElement[] {
    return (this.node.elements || []).map(XMLNodeElement.createInstance);
  }

  /**
   * 获取子节点的文本节点
   */
  getTextChildren(): string[] {
    return this.getChildren()
      .filter(item => item.getType() === ELEMENT_TYPES.TEXT)
      .map(item => String(item.getText()));
  }

  getChildText(): string {
    return this.getTextChildren()[0] || "";
  }

  /**
   * 获取子节点列表第一个指定 tagname 子节点
   * @param tagname 指定节点 tagname
   */
  getFirstChildOf(tagname: string): XMLNodeElement {
    const childElement = this.getChildren().find(
      item => item.getTagname() === tagname
    );
    return childElement || XMLNodeElement.createEmptyNode();
  }

  /**
   * 获取指定子节点列表
   * @param tagname 指定节点 tagname
   */
  getChildrenOf(tagname: string): XMLNodeElement[] {
    return this.getChildren().filter(item => item.getTagname() === tagname);
  }

  /**
   * 获得第一个子节点
   * @returns
   */
  getFirstChild(): XMLNodeElement {
    return this.getChildren()[0] || XMLNodeElement.createEmptyNode();
  }
}
