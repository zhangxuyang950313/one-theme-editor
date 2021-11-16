import { Attributes, Element } from "xml-js";
import { getPlaceholderVal } from "src/common/utils/index";
import { TypeXmlTempKeyValMap } from "src/types/config.page";
import { TypeKeyValue } from "src/types/utils";

import XMLNodeElement from "./XMLNodeElement";
import XmlCompiler from "./XmlCompiler";
import TempKeyValMapper from "./TempKeyValMapper";

export default class XmlCompilerExtra extends XMLNodeElement {
  /**
   * 获取所有 element 节数据
   * @returns
   */
  public getElementList(): Element[] {
    return this.getChildrenFirstElementNode()
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
      .getChildrenFirstElementNode()
      .getChildrenFirstNodeByAttrValue("name", name)
      .getChildrenFirstTextValue();
  }

  /**
   * @deprecated
   * 获取替换占位符后的 XMLNodeElement 实例
   * @param valuesFile 定义 key value 的文件
   * @returns
   */
  public replacePlaceholderByValFile(valuesFile: string): XMLNodeElement {
    const kvList = new TempKeyValMapper(valuesFile).getKeyValList();
    return XmlCompiler.fromString(this.generateXmlByKeyVal(kvList));
  }

  /**
   * @deprecated
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
  public getNameValueMapObj(kvList: TypeKeyValue[]): TypeXmlTempKeyValMap {
    return XmlCompiler.fromString(this.generateXmlByKeyVal(kvList))
      .getChildrenFirstElementNode()
      .getChildrenNodes()
      .reduce<TypeXmlTempKeyValMap>((obj, item) => {
        const nameVal = item.getAttributeOf("name");
        if (!nameVal) return obj;
        obj.set(nameVal, {
          value: item.getChildrenFirstTextValue(),
          description: item.getAttributeOf("description")
        });
        return obj;
      }, new Map());
  }

  /**
   * 获取匹配指定属性和属性值节点的 text 值
   * @param attrName 属性名称
   * @param val 属性值
   * @returns
   */
  public getTextByAttrValOf(attrName: string, val: string): string {
    return super
      .getChildrenFirstElementNode()
      .getChildrenFirstNodeByAttrValue(attrName, val)
      .getChildrenFirstTextValue();
  }

  /**
   * 获取匹配 name 属性节点的 text 值
   * @param val
   * @returns
   */
  public getTextByAttrNameVal(val: string): string {
    return this.getTextByAttrValOf("name", val);
  }

  /**
   * 匹配给定 tag 和 属性一致的节点
   * @param tag
   * @param attrsEntries
   */
  public findNodeByTagAndAttributes(
    tag: string,
    attrsEntries: [string, string][]
  ): XMLNodeElement {
    const matchedNode = super
      .getChildrenFirstElementNode()
      .getChildrenNodes()
      .find(node => {
        const tagIsEqual = node.getTagname() === tag;
        const attrObj = node.getAttributes(true);
        const attrsIsEqual = attrsEntries.every(
          ([key, value]) => attrObj[key] === value
        );
        return tagIsEqual && attrsIsEqual;
      });
    return matchedNode || XMLNodeElement.emptyNode;
  }

  /**
   * 匹配给定 tag 和 属性一致节点的 text 值
   * @param tag
   * @param attrsEntries
   */
  public findTextByTagAndAttrs(
    tag: string,
    attrsEntries: [string, string][]
  ): string {
    const matchedNode = this.findNodeByTagAndAttributes(tag, attrsEntries);
    return matchedNode ? String(matchedNode.getChildrenFirstTextValue()) : "";
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
  public generateXmlByKeyVal(kvList: TypeKeyValue[]): string {
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

  /**
   * 生成一段 xml 片段字符串
   * @param opt
   * @returns
   */
  static generateXmlNodeStr(opt: {
    tag: string;
    attributes: Attributes;
    elements?: Array<Element>;
  }): string {
    const nodeTemp = XmlCompilerExtra.createEmptyElementNode(
      opt.tag
    ).setAttributes(opt.attributes);
    if (Array.isArray(opt.elements)) {
      opt.elements.forEach(nodeTemp.appendChildrenElement);
    }
    const xmlTemp = XmlCompilerExtra.createEmptyRootNode(false)
      .appendChild(nodeTemp)
      .buildXml();
    return xmlTemp;
  }
}
