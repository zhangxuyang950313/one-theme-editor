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

  // 获取当前节点元素
  getElement(): Element {
    return this.node;
  }

  getElements(): Element[] {
    return this.node.elements || [];
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

  // 获取子节点元素列表
  getChildrenElement(): Element[] {
    return this.node.elements || [];
  }

  // 如果 getType 是 text，这里会获得节点的文本信息
  getText(): string | number | boolean {
    return this.node.text || "";
  }

  // 获取所有键值映射
  getAttributes(): Attributes {
    return this.node.attributes || {};
  }

  // 获取属性所有键
  getAttributeKeys(): string[] {
    return Object.keys(this.getAttributes());
  }

  // 获取属性所有值
  getAttributeValues(): string[] {
    return Object.values(String(this.getAttributes()));
  }

  /**
   * 获取节点指定键值
   * @param attr 键
   * @param def 指定默认值
   * @returns
   */
  getAttributeOf<T = string>(attr: string, def?: T): T {
    return (this.getAttributes()[attr] || def) as T;
  }

  /**
   * 获取所有子节点
   * @returns
   */
  getChildren(): XMLNodeElement[] {
    return this.getElements().map(XMLNodeElement.createInstance);
  }

  /**
   * 获取所有文本子节点
   * @returns
   */
  getTextChildren(): XMLNodeElement[] {
    return this.getChildren().filter(
      item => item.getType() === ELEMENT_TYPES.TEXT
    );
  }

  /**
   * 获得第一个子节点
   * @returns
   */
  getFirstChild(): XMLNodeElement {
    return this.getChildren()[0] || XMLNodeElement.createEmptyNode();
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
   * 获取第一个文本节点
   * @returns
   */
  getFirstTextChild(): XMLNodeElement {
    return this.getTextChildren()[0] || XMLNodeElement.createEmptyNode();
  }

  /**
   * 获取子节点的文本节点文本值
   */
  getTextChildrenValues(): string[] {
    return this.getTextChildren().map(item => String(item.getText()));
  }

  /**
   * 获取所有文本子节点的第第一个节点文本值
   * @returns
   */
  getFirstTextChildValue(): string {
    return this.getTextChildrenValues()[0] || "";
  }
}
