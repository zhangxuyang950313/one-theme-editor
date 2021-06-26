import path from "path";
import { asyncMap } from "common/utils";
import {
  TypeSourceConfig,
  TypeSourceModuleConf,
  TypeSourcePageGroupConf,
  TypeSourcePageConf
} from "types/source-config";
import {
  TypeOriginTempPageGroupConf,
  TypeOriginTempModulePageConf
} from "types/xml-result";
import Page from "@/data/Page";
import XMLNode from "@/core/XMLNode";
import SourceDescription from "@/data/SourceDescription";

// 解析 sourceConfig 所有数据
export default class SourceConfig extends SourceDescription {
  // 页面数据
  private async getPages(
    data: TypeOriginTempModulePageConf[]
  ): Promise<TypeSourcePageConf[]> {
    // 这里是在选择模板版本后得到的目标模块目录
    return asyncMap(data, item => {
      const rootDir = this.getRootDir();
      const pageNode = new XMLNode(item);
      const pathname = path.join(rootDir, pageNode.getAttribute("src"));
      const file = path.join(rootDir, pathname);
      return new Page({ file, pathname }).getData();
    });
  }

  // 页面分组数据
  private async getPageGroup(
    data: TypeOriginTempPageGroupConf[]
  ): Promise<TypeSourcePageGroupConf[]> {
    return asyncMap(data, async item => {
      const groupNode = new XMLNode(item);
      return {
        name: groupNode.getAttribute("name"),
        pages: item.page ? await this.getPages(item.page) : []
      };
    });
  }

  // 模块数据
  async getModules(): Promise<TypeSourceModuleConf[]> {
    const sourceData = await super.ensureXmlData();
    if (!Array.isArray(sourceData.module)) return [];
    return asyncMap(sourceData.module, async (item, index) => {
      const moduleNode = new XMLNode(item);
      const result: TypeSourceModuleConf = {
        index,
        name: moduleNode.getAttribute("name"),
        icon: moduleNode.getAttribute("icon"),
        groups: item.group ? await this.getPageGroup(item.group) : []
      };
      return result;
    });
  }

  /**
   * 解析全部模块数据
   */
  async getConfig(): Promise<TypeSourceConfig> {
    return {
      ...(await super.getDescription()),
      modules: await this.getModules()
    };
  }
}
