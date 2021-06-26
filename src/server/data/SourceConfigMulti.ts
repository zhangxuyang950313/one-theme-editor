import path from "path";
import { v4 as UUID } from "uuid";
import {
  TypeSourceDescription,
  TypeSourceConfig,
  TypeSourceModuleConf,
  TypeSourcePageGroupConf,
  TypeSourcePageConf,
  TypeUiVersion
} from "types/source-config";
import {
  TypeOriginTempConf,
  TypeOriginTempPageGroupConf,
  TypeOriginTempModulePageConf
} from "types/xml-result";
import { TypeImagePathLike } from "types/index";

import Page from "@/data/Page";
import XMLNode from "@/core/XMLNode";
import { xml2jsonCompact } from "@/compiler/xml";
import { asyncMap } from "common/utils";

import ERR_CODE from "renderer/core/error-code";

// 解析 sourceConfig 所有数据
export default class SourceConfig {
  // description.xml 路径
  private descFile = "";
  // description.xml 所在目录，即模板根目录
  private rootDir = "";
  // 模板解析数据
  private xmlData!: TypeOriginTempConf;
  constructor(descFile: string) {
    if (!descFile) throw new Error(ERR_CODE[3005]);

    this.descFile = descFile;
    this.rootDir = path.dirname(descFile);
  }

  private async ensureXmlData(): Promise<TypeOriginTempConf> {
    if (!this.xmlData) {
      this.xmlData = await xml2jsonCompact<TypeOriginTempConf>(this.descFile);
    }
    return this.xmlData;
  }

  getDescFile(): string {
    return this.descFile;
  }

  getRootDir(): string {
    return this.rootDir;
  }

  // 处理成模板根目录
  private resolvePath(relativePath: string): string {
    return path.join(this.rootDir, relativePath);
  }

  // 模板名称
  async getName(): Promise<string> {
    const tempData = await this.ensureXmlData();
    return tempData.description?.[0]._attributes.name || "";
  }

  // 模板版本
  async getVersion(): Promise<string> {
    const tempData = await this.ensureXmlData();
    return tempData.description?.[0]._attributes.version || "";
  }

  // 模板预览图
  async getPreview(): Promise<TypeImagePathLike> {
    const tempData = await this.ensureXmlData();
    // TODO: 默认预览图
    return tempData.preview?.[0]._attributes.src || "";
  }

  // 模板信息
  async getUiVersion(): Promise<TypeUiVersion> {
    const confData = await this.ensureXmlData();
    const { name = "", code = "" } = confData?.uiVersion?.[0]._attributes || {};
    return { name, code };
  }

  // 页面数据
  private async getPages(
    data: TypeOriginTempModulePageConf[]
  ): Promise<TypeSourcePageConf[]> {
    // 这里是在选择模板版本后得到的目标模块目录
    return asyncMap(data, item => {
      const pageNode = new XMLNode(item);
      const file = path.join(this.rootDir, pageNode.getAttribute("src"));
      return new Page(file).getData();
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
    const sourceData = await this.ensureXmlData();
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
   * 解析配置配置的简短信息
   * 只解析 description.xml 不需要全部解析
   */
  async getDescription(): Promise<TypeSourceDescription> {
    return {
      key: UUID(),
      file: this.descFile,
      namespace: this.rootDir,
      name: await this.getName(),
      version: await this.getVersion(),
      preview: await this.getPreview(),
      uiVersion: await this.getUiVersion()
    };
  }

  /**
   * 解析全部模块数据
   */
  async getConfig(): Promise<TypeSourceConfig> {
    const sourceDescription = await this.getDescription();
    return {
      ...sourceDescription,
      modules: await this.getModules()
    };
  }
}
