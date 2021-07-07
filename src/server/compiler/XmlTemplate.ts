import { Element } from "xml-js";
import XMLNodeElement from "./XMLNodeElement";
import BaseCompiler from "./BaseCompiler";

export default class XmlTemplate extends XMLNodeElement {
  private file: string;
  constructor(file: string) {
    super(BaseCompiler.compile<Element>(file));
    this.file = file;
  }

  /**
   * 获取占位模板字符串值
   * ```
   * ${class_integer_checkbox_stroke_d} -> class_integer_checkbox_stroke_d
   * ```
   * @param val
   * @returns string | null
   */
  private getPlaceholderVal(val: string): string | null {
    const match = /^\${(.+)}/.exec(val);
    return match && match[1] ? match[1] : null;
  }

  getData(): string[] {
    return [];
    // return super.getRootChildren().map(node => ({
    //   name: node.getAttributeOf("name"),
    //   attribute: node.getAttributes(),
    //   child: node.getFirstTextChildValue()
    // }));
  }

  /**
   * 获取所有 element 节数据
   * @returns
   */
  public getElementList(): Element[] {
    return super
      .getFirstChildNode()
      .getChildrenNodes()
      .map(item => item.getElement());
  }

  /**
   * 将模板中的字符串替换后返回 xml 字符串
   * 支持 text 节点、属性名、属性值
   * ```
   * key:     class_integer_checkbox_stroke_d
   * value:   target_text
   * result:  ${class_integer_checkbox_stroke_d} -> target_text
   * ```
   * @param key
   * @param value
   * @returns xmlString
   */
  public generateXml(key: string, value: string): string {
    return super.buildXml({
      attributeNameFn: attrName => {
        const placeholder = this.getPlaceholderVal(attrName);
        return placeholder === key ? value : attrName;
      },
      attributeValueFn: attrVal => {
        const placeholder = this.getPlaceholderVal(attrVal);
        return placeholder === key ? value : attrVal;
      },
      textFn: textVal => {
        const placeholder = this.getPlaceholderVal(textVal);
        return placeholder === key ? value : textVal;
      }
    });
  }
}
