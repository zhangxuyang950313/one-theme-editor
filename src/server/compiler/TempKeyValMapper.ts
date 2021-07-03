import {
  TypeSCPageXmlKeyValMapperConf,
  TypeSCPageXmlKeyValMapperMap,
  TypeSCPageKeyValConf
} from "types/source-config";
import BaseCompiler from "./BaseCompiler";

export default class TempKeyValMapper extends BaseCompiler {
  private keyValMapData?: TypeSCPageXmlKeyValMapperMap;

  async getDataList(): Promise<TypeSCPageXmlKeyValMapperConf[]> {
    return (await super.getRootChildren()).map(item => {
      return {
        key: item.getAttributeOf("name"),
        value: item.getFirstTextChildValue(),
        description: item.getAttributeOf("description")
      };
    });
  }

  async getDataObj(): Promise<TypeSCPageKeyValConf> {
    return (await super.getRootChildren()).reduce((total, item) => {
      const key = item.getAttributeOf("name");
      return key ? Object.assign(total, { [key]: item.getElement() }) : total;
    }, {} as TypeSCPageKeyValConf);
  }

  async getDataMap(): Promise<TypeSCPageXmlKeyValMapperMap> {
    if (this.keyValMapData) return this.keyValMapData;
    const rootNodes = await super.getRootChildren();
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
  async getValueByName(name: string): Promise<string> {
    const dataMap = await this.getDataMap();
    return dataMap.get(name)?.getFirstTextChildValue() || "";
  }

  /**
   * eg: <color name="class_color_top_title" description="顶栏标题文字颜色">{value}</color>
   * 通过 name 获取 value
   */
  async getDescriptionByName(name: string): Promise<string> {
    const dataMap = await this.getDataMap();
    return dataMap.get(name)?.getAttributeOf("description") || "";
  }
}
