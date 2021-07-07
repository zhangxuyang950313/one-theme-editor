import { js2xml, Element, Attributes, Options } from "xml-js";
import { ELEMENT_TYPES } from "src/enum/index";

const js2xmlOptions: Options.JS2XML = {
  spaces: 2,
  compact: false,
  indentText: false,
  indentCdata: false,
  indentAttributes: false,
  indentInstruction: false,
  fullTagEmptyElement: false,
  noQuotesForNativeAttributes: false
};

// 节点处理
export default class XMLNodeElement {
  private node: Element;
  constructor(node: Element) {
    this.node = node;
  }

  /**
   * 构建生成 xml 字符串
   * @param data
   * @param options
   * @returns string
   */
  public buildXml(options?: Options.JS2XML): string {
    return js2xml(this.node, { ...js2xmlOptions, ...options });
  }

  // 静态创建节点实例
  public static createInstance(node: Element): XMLNodeElement {
    return new XMLNodeElement(node);
  }

  // 静态创建一个空的节点实例
  public static createEmptyNode(): XMLNodeElement {
    return new XMLNodeElement({});
  }

  // 获取当前节点元素
  public getElement(): Element {
    return this.node;
  }

  // 获取子节点元素列表
  public getChildrenElements(): Element[] {
    return this.node.elements || [];
  }

  // 节点类型
  // TODO：枚举所有类型
  public getType(): ELEMENT_TYPES | string {
    return this.node.type || "";
  }

  // 标签名
  public getTagname(): string {
    return this.node.name || "";
  }

  // 如果 getType 是 text，这里会获得节点的文本信息
  public getText(): string | number | boolean {
    return this.node.text || "";
  }

  // 获取所有键值映射
  public getAttributes(): Attributes {
    return this.node.attributes || {};
  }

  // 获取属性所有键
  public getAttributeKeys(): string[] {
    return Object.keys(this.getAttributes());
  }

  // 获取属性所有值
  public getAttributeValues(): string[] {
    return Object.values(String(this.getAttributes()));
  }

  /**
   * 获取节点指定键值
   * @param attr 键
   * @param def 指定默认值
   * @returns
   */
  public getAttributeOf<T extends string>(attr: string, def?: T): T;
  public getAttributeOf(attr: string, def?: string): string;
  public getAttributeOf(attr: string, def?: number): number;
  public getAttributeOf(attr: string, def?: string | number): string | number {
    const val = this.getAttributes()[attr];
    if (typeof def === "number") {
      return Number.isNaN(Number(val)) ? def : Number(val);
    }
    if (typeof val === "string") {
      return val || def || "";
    }
    return def || "";
  }

  /**
   * 获取所有子节点
   * @returns
   */
  public getChildrenNodes(): XMLNodeElement[] {
    return this.getChildrenElements().map(XMLNodeElement.createInstance);
  }

  /**
   * 获取所有文本子节点
   * @returns
   */
  public getTextChildrenNodes(): XMLNodeElement[] {
    return this.getChildrenNodes().filter(
      item => item.getType() === ELEMENT_TYPES.TEXT
    );
  }

  /**
   * 获得第一个子节点
   * @returns
   */
  public getFirstChildNode(): XMLNodeElement {
    return this.getChildrenNodes()[0] || XMLNodeElement.createEmptyNode();
  }

  /**
   * 获取子节点列表第一个指定 tagname 子节点
   * @param tagname 指定节点 tagname
   */
  public getFirstChildNodeByTagname(tagname: string): XMLNodeElement {
    const childNode = this.getChildrenNodes().find(
      item => item.getTagname() === tagname
    );
    return childNode || XMLNodeElement.createEmptyNode();
  }

  /**
   * 获取子节点第一个 elementType 类型的节点
   * @param type
   * @returns
   */
  public getFirstChildNodeByType(type: ELEMENT_TYPES): XMLNodeElement {
    const childNode = this.getChildrenNodes().find(
      item => item.getType() === type
    );
    return childNode || XMLNodeElement.createEmptyNode();
  }

  /**
   * 获取指定子节点列表
   * @param tagname 指定节点 tagname
   */
  public getChildrenNodesByTagname(tagname: string): XMLNodeElement[] {
    return this.getChildrenNodes().filter(
      item => item.getTagname() === tagname
    );
  }

  /**
   * 获取第一个文本节点
   * @returns
   */
  public getFirstTextChildNode(): XMLNodeElement {
    const childNode = this.getChildrenNodes().find(
      item => item.getTagname() === ELEMENT_TYPES.TEXT
    );
    return childNode || XMLNodeElement.createEmptyNode();
  }

  /**
   * 获取子节点的文本节点文本值
   */
  public getTextChildrenValues(): string[] {
    return this.getTextChildrenNodes().map(item => String(item.getText()));
  }

  /**
   * 获取所有文本子节点的第第一个节点文本值
   * @returns
   */
  public getFirstTextChildValue(): string {
    return this.getTextChildrenValues()[0] || "";
  }

  /**
   * 修改/添加属性值
   * @param attr
   * @param val
   */
  public setAttributeOf(attr: string, val: string | number | boolean): void {
    const attributes = this.getAttributes();
    if (!attributes) return;
    attributes[attr] = String(val);
  }

  /**
   * 设置 text 节点的值
   * @param value
   */
  public setTextNodeValue(value: string): void {
    if (this.getType() !== ELEMENT_TYPES.TEXT) return;
    this.node.text = value;
    console.log(this.node.text);
  }
}
