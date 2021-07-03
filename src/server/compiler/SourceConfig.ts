import path from "path";
import fse from "fs-extra";
import { v4 as UUID } from "uuid";
import {
  TypeSourceConfig,
  TypeSCModuleConf,
  TypeSCPageGroupConf,
  TypeSCPageConf,
  TypeSourceDescription,
  TypeSCPageSourceTypeConf
} from "types/source-config";
import { TypeBrandConf, TypeUiVersion } from "types/project";
import { asyncMap } from "common/utils";
import ERR_CODE from "renderer/core/error-code";
import {
  getSCDescriptionByNamespace,
  SOURCE_CONFIG_FILE
} from "../core/pathUtils";
import Page from "./Page";
import XMLNodeElement from "./XMLNodeElement";
import BaseCompiler from "./BaseCompiler";

// 解析 sourceConfig xml 配置文件
export default class SourceConfig extends BaseCompiler {
  private rootDir = "";
  private sourceConfigFile = "";
  private namespace = "";
  constructor(file: string) {
    super(file);
    this.rootDir = path.dirname(file);
  }

  // 读取厂商配置
  static async readBrandConf(): Promise<TypeBrandConf[]> {
    if (!fse.existsSync(SOURCE_CONFIG_FILE)) {
      throw new Error(ERR_CODE[4003]);
    }
    return fse.readJsonSync(SOURCE_CONFIG_FILE);
  }

  /**
   * 解析当前厂商下所有预览配置
   * @param brandType 厂商 type
   * @returns
   */
  static async getDescriptionList(
    brandType: string
  ): Promise<TypeSourceDescription[]> {
    const brandConfList = await this.readBrandConf();
    const brandConf = brandConfList.find(item => item.type === brandType);
    if (!brandConf?.sourceConfigs) return [];
    const ensureConfigs = brandConf.sourceConfigs.flatMap(namespace => {
      const absPath = getSCDescriptionByNamespace(namespace);
      return fse.existsSync(absPath) ? [absPath] : [];
    });
    return asyncMap(ensureConfigs, configFile =>
      new SourceConfig(configFile).getDescription()
    );
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
    return this.sourceConfigFile;
  }

  // 模板名称
  async getName(): Promise<string> {
    const rootNode = await super.getRootNode();
    return rootNode.getAttributeOf("name");
  }

  // 模板版本
  async getVersion(): Promise<string> {
    const rootNode = await super.getRootNode();
    return rootNode.getAttributeOf("version");
  }

  // 模板预览图
  async getPreview(): Promise<string> {
    // TODO: 默认预览图
    return (await super.getRootFirstChildOf("preview")).getAttributeOf("src");
  }

  // 模板信息
  async getUiVersion(): Promise<TypeUiVersion> {
    const uiVersionNode = await super.getRootFirstChildOf("uiVersion");
    return {
      name: uiVersionNode.getAttributeOf("name"),
      code: uiVersionNode.getAttributeOf("code")
    };
  }

  // 素材类型定义列表
  async getSourceTypeList(): Promise<TypeSCPageSourceTypeConf[]> {
    const sourceNodeList = await super.getRootChildrenOf("source");
    return sourceNodeList.map(item => {
      return {
        tag: item.getAttributeOf("tag"),
        name: item.getAttributeOf("name"),
        type: item.getAttributeOf("type")
      };
    });
  }

  // 页面数据
  async getPageList(pageNodeList: XMLNodeElement[]): Promise<TypeSCPageConf[]> {
    // 这里是在选择模板版本后得到的目标模块目录
    return asyncMap(pageNodeList, node => {
      const pageFile = this.resolvePath(node.getAttributeOf("src"));
      return new Page(pageFile).getData();
    });
  }

  // 页面分组数据
  async getPageGroupList(
    groupNodeList: XMLNodeElement[]
  ): Promise<TypeSCPageGroupConf[]> {
    return asyncMap(groupNodeList, async groupNode => {
      const group: TypeSCPageGroupConf = {
        name: groupNode.getAttributeOf("name"),
        pageList: await this.getPageList(groupNode.getChildrenOf("page"))
      };
      return group;
    });
  }

  // 模块数据
  async getModuleList(): Promise<TypeSCModuleConf[]> {
    const moduleNodeList = await super.getRootChildrenOf("module");
    return asyncMap(moduleNodeList, async (moduleNode, index) => {
      const result: TypeSCModuleConf = {
        index,
        name: moduleNode.getAttributeOf("name"),
        icon: moduleNode.getAttributeOf("icon"),
        groupList: await this.getPageGroupList(
          moduleNode.getChildrenOf("group")
        )
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
      sourceTypeList: await this.getSourceTypeList(),
      moduleList: await this.getModuleList()
    };
  }
}
