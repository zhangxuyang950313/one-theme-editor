import { TypeKeyValue } from "types/index";
import {
  TypeSourceXmlKeyValConf,
  TypeSourceXmlKeyValMapperMap,
  TypeSourcePageKeyValMapConf
} from "types/source-config";
import BaseCompiler from "./BaseCompiler";

export default class TempKeyValMapper extends BaseCompiler {
  private keyValMapData?: TypeSourceXmlKeyValMapperMap;

  /**
   * 获取 key value 列表
   * @returns
   */
  getKeyValList(): TypeKeyValue[] {
    return super.getRootChildrenNodes().map(item => ({
      key: item.getAttributeOf("name"),
      value: item.getAttributeOf("value") || item.getFirstTextChildValue()
    }));
  }

  /**
   * 获取数据列表
   * @returns
   */
  getDataList(): TypeSourceXmlKeyValConf[] {
    return super.getRootChildrenNodes().map(item => ({
      name: item.getAttributeOf("name"),
      value: item.getAttributeOf("value") || item.getFirstTextChildValue(),
      description: item.getAttributeOf("description")
    }));
  }

  /**
   * 获取以 name 为 key 的对象
   * @returns
   */
  getDataObj(): TypeSourcePageKeyValMapConf {
    return super.getRootChildrenNodes().reduce((total, item) => {
      const key = item.getAttributeOf("name");
      if (!key) return total;
      const data: TypeSourcePageKeyValMapConf = {
        [key]: {
          value: item.getAttributeOf("value") || item.getFirstTextChildValue(),
          description: item.getAttributeOf("description")
        }
      };
      return Object.assign(total, data);
    }, {});
  }

  /**
   * 获取以 name 为 key 的 map
   * @returns
   */
  getDataMap(): TypeSourceXmlKeyValMapperMap {
    if (this.keyValMapData) return this.keyValMapData;
    const rootNodes = super.getRootChildrenNodes();
    const map: TypeSourceXmlKeyValMapperMap = new Map();
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
