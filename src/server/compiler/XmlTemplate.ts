import { Element } from "xml-js";
import { getPlaceholderVal } from "common/utils";
import { TypeKeyValue } from "src/types";
import XMLNodeElement from "./XMLNodeElement";
import BaseCompiler from "./BaseCompiler";

export default class XmlTemplate extends BaseCompiler {
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
      .getRootNode()
      .getChildrenNodes()
      .map(item => item.getElement());
  }

  /**
   * 获取 name 属性值匹配的节点子节点文字
   * ```xml
   * <!-- 这个方法获取到 ${class_bool_default_theme} -->
   * <bool name="default_theme">${class_bool_default_theme}</bool>
   * ```
   * @param name
   * @returns
   */
  public getValueByName(name: string): string {
    return super
      .getRootNode()
      .getFirstChildNodeByAttrValue("name", name)
      .getFirstTextChildValue();
  }

  /**
   * 获取替换占位符后的 XMLNodeElement 实例
   * @param name
   * @param mapperFile
   * @returns
   */
  public getPlaceholderReplacedNode(kvList: TypeKeyValue[]): XMLNodeElement {
    return super.createInstance(BaseCompiler.compile(this.generateXml(kvList)));
  }

  /**
   * 获取模板 name 和 textVal 的映射对象
   * 解析忽略节点 tag
   * ```xml
   * <color name="a">b</color>
   * <color name="b">c</color>
   * ```
   * ->
   * ```json
   *  {
   *    "a": "b",
   *    "b": "c"
   *  }
   * ```
   * @param kvList
   * @returns
   */
  public getNameValueMapObj(kvList: TypeKeyValue[]): Record<string, string> {
    return super
      .createInstance(BaseCompiler.compile(this.generateXml(kvList)))
      .getFirstChildNode()
      .getChildrenNodes()
      .reduce<Record<string, string>>((obj, item) => {
        const nameVal = item.getAttributeOf("name");
        if (!nameVal) return obj;
        obj[nameVal] = item.getFirstTextChildValue();
        return obj;
      }, {});
  }

  /**
   * 获取匹配 name 属性节点的 text 值
   * @param name
   * @param mapperFile
   * @returns
   */
  public getTextByAttrName(name: string, kvList: TypeKeyValue[]): string {
    return this.getPlaceholderReplacedNode(kvList)
      .getFirstChildNodeByAttrValue("name", name)
      .getFirstTextChildValue();
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
  public generateXml(kvList: TypeKeyValue[]): string {
    const kvMap = kvList.reduce((t, o) => {
      t.set(o.key, o.value);
      return t;
    }, new Map<string, string>());
    return super.buildXml({
      attributeNameFn: attrName => {
        const placeholder = getPlaceholderVal(attrName);
        if (!placeholder) return attrName;
        return kvMap.get(placeholder) || attrName;
      },
      attributeValueFn: attrVal => {
        const placeholder = getPlaceholderVal(attrVal);
        if (!placeholder) return attrVal;
        return kvMap.get(placeholder) || attrVal;
      },
      textFn: textVal => {
        const placeholder = getPlaceholderVal(textVal);
        if (!placeholder) return textVal;
        return kvMap.get(placeholder) || textVal;
      }
    });
  }
}
