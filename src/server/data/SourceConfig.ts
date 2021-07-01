import path from "path";
import fse from "fs-extra";
import { v4 as UUID } from "uuid";
import {
  TypeSourceConfig,
  TypeSCModuleConf,
  TypeSCPageGroupConf,
  TypeSCPageConf,
  TypeSourceDescription
} from "types/source-config";
import {
  TypeXMLPageGroupConf,
  TypeXMLPageNode,
  TypeXMLSourceConf
} from "types/xml-result";
import { TypeUiVersion } from "types/project";
import { asyncMap } from "common/utils";
import { xml2jsonCompact } from "@/compiler/xml";
import { SOURCE_CONFIG_DIR } from "@/core/pathUtils";
import Page from "@/data/Page";
import XMLNode from "@/core/XMLNode";
import ERR_CODE from "renderer/core/error-code";

// 解析 sourceConfig xml 配置文件
export default class SourceConfig {
  private rootDir = SOURCE_CONFIG_DIR;
  private descFile = "";
  private namespace = "";
  // 模板解析数据
  private xmlData!: TypeXMLSourceConf;
  static filename = "description.xml";
  constructor(configFile: string) {
    if (!fse.existsSync(configFile)) {
      throw new Error(ERR_CODE[3005]);
    }
    this.descFile = configFile;
    this.namespace = path.relative(this.rootDir, path.dirname(configFile));
  }

  private async ensureXmlData(): Promise<TypeXMLSourceConf> {
    if (!this.xmlData) {
      this.xmlData = await xml2jsonCompact<TypeXMLSourceConf>(this.descFile);
    }
    return this.xmlData;
  }

  // 处理成模板根目录
  private resolvePath(relativePath: string): string {
    return path.join(this.rootDir, this.namespace, relativePath);
  }

  getRootDir(): string {
    return this.rootDir;
  }

  getNamespace(): string {
    return this.namespace;
  }

  getDescFile(): string {
    return this.descFile;
  }

  // 模板名称
  async getName(): Promise<string> {
    const xmlData = await this.ensureXmlData();
    return new XMLNode(xmlData)
      .getFirstChildOf("description")
      .getAttribute("name");
  }

  // 模板版本
  async getVersion(): Promise<string> {
    const xmlData = await this.ensureXmlData();
    return new XMLNode(xmlData)
      .getFirstChildOf("description")
      .getAttribute("version");
  }

  // 模板预览图
  async getPreview(): Promise<string> {
    const xmlData = await this.ensureXmlData();
    // TODO: 默认预览图
    return new XMLNode(xmlData).getFirstChildOf("preview").getAttribute("src");
  }

  // 模板信息
  async getUiVersion(): Promise<TypeUiVersion> {
    const xmlData = await this.ensureXmlData();
    const { name = "", code = "" } = xmlData?.uiVersion?.[0]._attributes || {};
    return { name, code };
  }

  // 页面数据
  async getPages(data: TypeXMLPageNode[]): Promise<TypeSCPageConf[]> {
    // 这里是在选择模板版本后得到的目标模块目录
    return asyncMap(data, item => {
      const pageNode = new XMLNode(item);
      const pageFile = this.resolvePath(pageNode.getAttribute("src"));
      return new Page(pageFile, this.namespace).getData();
    });
  }

  // 页面分组数据
  async getPageGroup(
    data: TypeXMLPageGroupConf[]
  ): Promise<TypeSCPageGroupConf[]> {
    return asyncMap(data, async item => {
      const groupNode = new XMLNode(item);
      return {
        name: groupNode.getAttribute("name"),
        pages: item.page ? await this.getPages(item.page) : []
      };
    });
  }

  // 模块数据
  async getModules(): Promise<TypeSCModuleConf[]> {
    const sourceData = await this.ensureXmlData();
    if (!Array.isArray(sourceData.module)) return [];
    return asyncMap(sourceData.module, async (item, index) => {
      const moduleNode = new XMLNode(item);
      const result: TypeSCModuleConf = {
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
      namespace: this.getNamespace(),
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
    return {
      ...(await this.getDescription()),
      modules: await this.getModules()
    };
  }
}
