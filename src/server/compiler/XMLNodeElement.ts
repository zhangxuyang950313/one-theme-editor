import { js2xml, Element, Attributes, Options } from "xml-js";
import { ELEMENT_TYPE } from "src/enum/index";

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

/**
 * xml 节点基础解析类
 */
class XMLNodeBase {
  protected node: Element;
  constructor(node: Element) {
    this.node = node;
  }

  // 当前是空节点
  public isEmpty(): boolean {
    return Object.keys(this.node).length === 0;
  }

  // 当前是元素节点
  public isElement(): boolean {
    return this.node.type === "element";
  }

  // 当前是注释节点
  public isComment(): boolean {
    return this.node.type === "comment";
  }

  public clear(): this {
    const { node } = this;
    for (const key in node) {
      const k = key as keyof typeof node;
      delete node[k];
    }
    return this;
  }

  // 覆盖当前节点
  public setNode(node: XMLNodeElement): this {
    this.node = node.getElement();
    return this;
  }

  // 覆盖当前节点
  public setElement(node: Element): this {
    this.node = node;
    return this;
  }

  // 获取当前节点元素
  public getElement(): Element {
    return this.node;
  }

  // 节点类型
  // TODO：枚举所有类型
  public getType(): ELEMENT_TYPE | string {
    return this.node.type || "";
  }

  // 标签名
  public getTagname<T extends string>(): T {
    return (this.node.name || "") as T;
  }

  // 注释信息
  public getComment(): string {
    return this.node.type === "comment" ? this.node.comment ?? "" : "";
  }

  // 如果 getType 是 text，这里会获得节点的文本信息
  public getText(): string | number | boolean {
    return this.node.text ?? "";
  }

  // 获取所有键值映射，支持忽略特殊键，但忽略后得出的 Attributes 为拷贝后的值，不能再被继续修改，否则失效
  public getAttributes(ignoreKeys = false): Attributes {
    const keys = [":key"];
    const attributes = this.node.attributes || {};
    if (!ignoreKeys) return attributes;
    const result: Attributes = {};
    for (const key in attributes) {
      if (keys.includes(key)) continue;
      result[key] = attributes[key];
    }
    return result;
  }

  // 获取属性所有键
  public getAttributeKeys(): string[] {
    return Object.keys(this.getAttributes(true));
  }

  // 获取属性所有值
  public getAttributeValues(): string[] {
    return Object.values(this.getAttributes(true)).flatMap(item =>
      item === undefined ? [] : String(item)
    );
  }

  public getAttributeEntries() {
    return Object.entries(this.getAttributes(true)).flatMap<[string, string]>(
      item => (item[1] === undefined ? [] : [[item[0], String(item[1])]])
    );
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
      return val ?? def ?? "";
    }
    return def ?? "";
  }

  /**
   * 修改/添加属性值
   * @param attr
   * @param val
   */
  public setAttributeOf(attr: string, val: string | number | boolean): this {
    if (!this.node.attributes) {
      this.node.attributes = {};
    }
    if (!this.node.attributes) return this;
    this.node.attributes[attr] = String(val);
    return this;
  }

  /**
   * 设置 text 节点的值
   * @param value
   */
  public setTextNodeValue(value: string): this {
    if (this.getType() !== ELEMENT_TYPE.TEXT) return this;
    this.node.text = value;
    return this;
  }
}

/**
 * XML 子节点解析类
 */
class XMLNodeChildren extends XMLNodeBase {
  /**
   * 清空子节点
   * @returns
   */
  public removeChildren(): this {
    this.getChildrenElements().length = 0;
    return this;
  }

  // 获取子节点元素列表
  public getChildrenElements(): Element[] {
    return this.getElement().elements || [];
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
      item => item.getType() === ELEMENT_TYPE.TEXT
    );
  }

  /**
   * 获取第一个子节点
   * @returns
   */
  public getFirstChildNode(): XMLNodeElement {
    return XMLNodeElement.createInstance(this.getChildrenElements()[0] || {});
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
  public getFirstChildNodeByType(type: ELEMENT_TYPE): XMLNodeElement {
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
   * 和 getChildrenNodesByTagname 不同，这个方法可同时获取多个 tagname 元素，用于保持顺序
   * @param tagnameList
   */
  public getChildrenNodeByMultiTagname(
    tagnameList: string[]
  ): XMLNodeElement[] {
    const tagnameSet = new Set(tagnameList);
    return this.getChildrenNodes().filter(item =>
      tagnameSet.has(item.getTagname())
    );
  }

  /**
   * 获取第一个文本节点
   * @returns
   */
  public getFirstTextChildNode(): XMLNodeElement {
    const childNode = this.getChildrenNodes().find(
      item => item.getType() === ELEMENT_TYPE.TEXT
    );
    return childNode || XMLNodeElement.createEmptyNode();
  }

  /**
   * 获取所有文本子节点的第一个节点文本值
   * @returns
   */
  public getFirstTextChildValue(): string {
    return String(this.getFirstTextChildNode().getText()) ?? "";
  }

  /**
   * 获取属性和值匹配的节点列表
   * @param attr
   * @param val
   */
  public getChildrenNodeByAttrValue(
    attr: string,
    val: string
  ): XMLNodeElement[] {
    return this.getChildrenNodes().filter(
      item => item.getAttributeOf(attr) === val
    );
  }

  /**
   * 获取第一个属性和值匹配的节点
   * @param attr
   * @param val
   * @returns
   */
  public getFirstChildNodeByAttrValue(
    attr: string,
    val: string
  ): XMLNodeElement {
    return (
      this.getChildrenNodes().find(item => item.getAttributeOf(attr) === val) ||
      XMLNodeElement.createEmptyNode()
    );
  }
}

// 处理 node 数据
class XMLNodeHandler extends XMLNodeChildren {
  // 向子节点添加一个节点
  public appendChild(node: XMLNodeElement): this {
    this.getChildrenElements().push(node.getElement());
    return this;
  }
  // 替换节点
  public replaceNode(newNode: XMLNodeElement): this {
    if (newNode.isEmpty()) return this;
    Object.assign(super.clear().getElement(), newNode.getElement());
    return this;
  }
}

/**
 * 继承合并导出，增加类即可
 */
export default class XMLNodeElement extends XMLNodeHandler {
  /**
   * 构建生成 xml 字符串
   * @param data
   * @param options
   * @returns string
   */
  public buildXml(options?: Options.JS2XML): string {
    return js2xml(this.getElement(), { ...js2xmlOptions, ...options });
  }

  // 创建节点实例
  public static createInstance(node: Element): XMLNodeElement {
    return new XMLNodeElement(node);
  }

  // 创建一个空的节点实例
  public static createEmptyNode(): XMLNodeElement {
    return new XMLNodeElement({});
  }

  // 创建已给文本节点
  public static createTextNode(text?: string): XMLNodeElement {
    return new XMLNodeElement({ type: ELEMENT_TYPE.TEXT, text: text ?? "" });
  }

  public createInstance(node: Element): XMLNodeElement {
    return XMLNodeElement.createInstance(node);
  }

  public createEmptyNode(): XMLNodeElement {
    return XMLNodeElement.createEmptyNode();
  }
}
