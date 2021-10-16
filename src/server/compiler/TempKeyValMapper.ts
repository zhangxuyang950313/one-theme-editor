import { TypeKeyValue } from "src/types/index";
import {
  TypeXmlKeyValConfig,
  TypeXmlKeyValMapperMap,
  TypeXmlTempKeyValMap
} from "src/types/resource.page";
import XmlFileCompiler from "./XmlFileCompiler";

export default class TempKeyValMapper extends XmlFileCompiler {
  private keyValMapData?: TypeXmlKeyValMapperMap;

  /**
   * 获取 key value 列表
   * @returns
   */
  getKeyValList(): TypeKeyValue[] {
    return super
      .getFirstElementChildNode()
      .getChildrenNodes()
      .map(item => ({
        key: item.getAttributeOf("name"),
        value: item.getAttributeOf("value") || item.getFirstTextChildValue()
      }));
  }

  /**
   * 获取数据列表
   * @returns
   */
  getDataList(): TypeXmlKeyValConfig[] {
    return super
      .getFirstElementChildNode()
      .getChildrenNodes()
      .map(item => ({
        name: item.getAttributeOf("name"),
        value: item.getAttributeOf("value") || item.getFirstTextChildValue(),
        description: item.getAttributeOf("description")
      }));
  }

  /**
   * 获取以 name 为 key 的对象
   * @returns
   */
  getDataObj(): TypeXmlTempKeyValMap {
    return super
      .getFirstElementChildNode()
      .getChildrenNodes()
      .reduce<TypeXmlTempKeyValMap>((total, item) => {
        const key = item.getAttributeOf("name");
        if (!key) return total;
        total.set(key, {
          value: item.getAttributeOf("value") || item.getFirstTextChildValue(),
          description: item.getAttributeOf("description")
        });
        return total;
      }, new Map());
  }

  /**
   * 获取以 name 为 key 的 map
   * @returns
   */
  getDataMap(): TypeXmlKeyValMapperMap {
    if (this.keyValMapData) return this.keyValMapData;
    const rootNodes = super.getFirstElementChildNode().getChildrenNodes();
    const map: TypeXmlKeyValMapperMap = new Map();
    rootNodes.forEach(item => {
      map.set(item.getAttributeOf("name"), item);
    });
    this.keyValMapData = map;
    return map;
  }

  /**
   * eg: <color name="class_color_top_title" description="顶栏标题文字颜色">{value}</color>
   * 通过 class_color_top_title 获取 value
   */
  getValueByName(name: string): string {
    const dataMap = this.getDataMap();
    return dataMap.get(name)?.getFirstTextChildValue() || "";
  }

  /**
   * eg: <color name="class_color_top_title" description="顶栏标题文字颜色">{value}</color>
   * 通过 class_color_top_title 获取 顶栏标题文字颜色
   */
  getDescriptionByName(name: string): string {
    const dataMap = this.getDataMap();
    return dataMap.get(name)?.getAttributeOf("description") || "";
  }
}
