import {
  TypeSCPageXmlKeyValMapperConf,
  TypeSCPageXmlKeyValMapperMap,
  TypeSCPageKeyValConf
} from "types/source-config";
import BaseCompiler from "./BaseCompiler";

export default class TempKeyValMapper extends BaseCompiler {
  private keyValMapData?: TypeSCPageXmlKeyValMapperMap;

  getDataList(): TypeSCPageXmlKeyValMapperConf[] {
    return super.getRootChildren().map(item => ({
      key: item.getAttributeOf("name"),
      value: item.getFirstTextChildValue(),
      description: item.getAttributeOf("description")
    }));
  }

  getDataObj(): TypeSCPageKeyValConf {
    return super.getRootChildren().reduce((total, item) => {
      const key = item.getAttributeOf("name");
      if (!key) return total;
      const data: TypeSCPageKeyValConf = {
        [key]: {
          value: item.getFirstTextChildValue(),
          description: item.getAttributeOf("description")
        }
      };
      return Object.assign(total, data);
    }, {});
  }

  getDataMap(): TypeSCPageXmlKeyValMapperMap {
    if (this.keyValMapData) return this.keyValMapData;
    const rootNodes = super.getRootChildren();
    const map: TypeSCPageXmlKeyValMapperMap = new Map();
    rootNodes.forEach(item => {
      map.set(item.getAttributeOf("name"), item);
    });
    return map;
  }

  /**
   * eg: <color name="class_color_top_title" description="顶栏标题文字颜色">{value}</color>
   * 通过 name 获取 value
   */
  getValueByName(name: string): string {
    const dataMap = this.getDataMap();
    return dataMap.get(name)?.getFirstTextChildValue() || "";
  }

  /**
   * eg: <color name="class_color_top_title" description="顶栏标题文字颜色">{value}</color>
   * 通过 name 获取 value
   */
  getDescriptionByName(name: string): string {
    const dataMap = this.getDataMap();
    return dataMap.get(name)?.getAttributeOf("description") || "";
  }
}
