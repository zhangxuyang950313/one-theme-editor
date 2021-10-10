import { Element } from "xml-js";
import { getPlaceholderVal } from "src/common/utils/index";
import { TypeKeyValue } from "src/types";
import { TypeXmlTempKeyValMap } from "src/types/resource.config";
import XMLNodeElement from "./XMLNodeElement";
import XmlFileCompiler from "./XmlFileCompiler";
import TempKeyValMapper from "./TempKeyValMapper";

export default class XmlTemplate extends XMLNodeElement {
  /**
   * 获取第一个子节点
   * @returns
   */
  public getRootNode(): XMLNodeElement {
    return super.getFirstChildNode();
  }
  /**
   * 获取所有 element 节数据
   * @returns
   */
  public getElementList(): Element[] {
    return this.getRootNode()
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
    return this.getRootNode()
      .getFirstChildNodeByAttrValue("name", name)
      .getFirstTextChildValue();
  }

  /**
   * 获取替换占位符后的 XMLNodeElement 实例
   * @param valuesFile 定义 key value 的文件
   * @returns
   */
  public replacePlaceholderByValFile(valuesFile: string): XMLNodeElement {
    const kvList = new TempKeyValMapper(valuesFile).getKeyValList();
    return super.createInstance(
      XmlFileCompiler.compile(this.generateXmlByKeyVal(kvList))
    );
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
  public getNameValueMapObj(kvList: TypeKeyValue[]): TypeXmlTempKeyValMap {
    return super
      .createInstance(XmlFileCompiler.compile(this.generateXmlByKeyVal(kvList)))
      .getFirstChildNode()
      .getChildrenNodes()
      .reduce<TypeXmlTempKeyValMap>((obj, item) => {
        const nameVal = item.getAttributeOf("name");
        if (!nameVal) return obj;
        obj.set(nameVal, {
          value: item.getFirstTextChildValue(),
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
      .getFirstChildNode()
      .getFirstChildNodeByAttrValue(attrName, val)
      .getFirstTextChildValue();
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
}
