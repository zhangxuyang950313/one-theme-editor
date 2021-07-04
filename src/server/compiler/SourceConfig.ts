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
import ERR_CODE from "renderer/core/error-code";
import PATHS from "server/core/pathUtils";
import Page from "./Page";
import XMLNodeElement from "./XMLNodeElement";
import BaseCompiler from "./BaseCompiler";

// 解析 sourceConfig xml 配置文件
export default class SourceConfig extends BaseCompiler {
  private rootDir = "";
  constructor(file: string) {
    super(file);
    this.rootDir = path.dirname(file);
  }

  // 读取厂商配置
  static readBrandConf(): TypeBrandConf[] {
    if (!fse.existsSync(PATHS.SOURCE_CONFIG_FILE)) {
      throw new Error(ERR_CODE[4003]);
    }
    return fse.readJsonSync(PATHS.SOURCE_CONFIG_FILE);
  }

  /**
   * 解析当前厂商下所有预览配置
   * @param brandType 厂商 type
   * @returns
   */
  static getDescriptionList(brandType: string): TypeSourceDescription[] {
    const brandConfList = this.readBrandConf();
    const brandConf = brandConfList.find(item => item.type === brandType);
    if (!brandConf?.sourceConfigs) return [];
    const ensureConfigs = brandConf.sourceConfigs
      .map(item => path.join(PATHS.SOURCE_CONFIG_DIR, item))
      .filter(fse.existsSync);
    return ensureConfigs.map(configFile =>
      new SourceConfig(configFile).getDescription()
    );
  }

  // 处理成模板根目录
  private resolvePath(src: string): string {
    return path.join(this.rootDir, src);
  }

  // 处理成素材相对路径
  private relativePath(src: string): string {
    const namespace = path.relative(PATHS.SOURCE_CONFIG_DIR, this.rootDir);
    return path.join(namespace, src);
  }

  getRootDir(): string {
    return this.rootDir;
  }

  getDescFile(): string {
    return this.getFile();
  }

  // 模板名称
  getName(): string {
    const rootNode = super.getRootNode();
    return rootNode.getAttributeOf("name");
  }

  // 模板版本
  getVersion(): string {
    const rootNode = super.getRootNode();
    return rootNode.getAttributeOf("version");
  }

  // 模板预览图
  getPreview(): string {
    // TODO: 默认预览图
    const src = super.getRootFirstChildOf("preview").getAttributeOf("src");
    return this.relativePath(src);
  }

  // 模板信息
  getUiVersion(): TypeUiVersion {
    const uiVersionNode = super.getRootFirstChildOf("uiVersion");
    return {
      name: uiVersionNode.getAttributeOf("name"),
      code: uiVersionNode.getAttributeOf("code")
    };
  }

  // 素材类型定义列表
  getSourceTypeList(): TypeSCPageSourceTypeConf[] {
    const sourceNodeList = super.getRootChildrenOf("source");
    return sourceNodeList.map(item => ({
      tag: item.getAttributeOf("tag"),
      name: item.getAttributeOf("name"),
      type: item.getAttributeOf("type")
    }));
  }

  // 页面配置列表
  getPageConfList(pageNodeList: XMLNodeElement[]): TypeSCPageConf[] {
    // 这里是在选择模板版本后得到的目标模块目录
    return pageNodeList.map(node => {
      const src = node.getAttributeOf("src");
      const previewList = new Page(this.resolvePath(src)).getPreviewList();
      return {
        name: node.getAttributeOf("name"),
        preview: previewList[0],
        src: this.relativePath(src)
      };
    });
  }

  // // 页面数据列表
  // getPageList(pageNodeList: XMLNodeElement[]): TypeSCPageData[] {
  //   // 这里是在选择模板版本后得到的目标模块目录
  //   return pageNodeList.map(node => {
  //     const pageFile = this.resolvePath(node.getAttributeOf("src"));
  //     return new Page(pageFile).getData();
  //   });
  // }

  // 页面分组数据
  getPageGroupList(groupNodeList: XMLNodeElement[]): TypeSCPageGroupConf[] {
    return groupNodeList.map(groupNode => {
      const group: TypeSCPageGroupConf = {
        name: groupNode.getAttributeOf("name"),
        pageList: this.getPageConfList(groupNode.getChildrenOf("page"))
      };
      return group;
    });
  }

  // 模块配置数据
  getModuleList(): TypeSCModuleConf[] {
    const moduleNodeList = super.getRootChildrenOf("module");
    return moduleNodeList.map((moduleNode, index) => ({
      index,
      name: moduleNode.getAttributeOf("name"),
      icon: this.relativePath(moduleNode.getAttributeOf("icon")),
      groupList: this.getPageGroupList(moduleNode.getChildrenOf("group"))
    }));
  }

  /**
   * 解析配置配置的简短信息
   * 只解析 description.xml 不需要全部解析
   */
  getDescription(): TypeSourceDescription {
    return {
      key: UUID(),
      file: path.relative(PATHS.SOURCE_CONFIG_DIR, this.getDescFile()),
      name: this.getName(),
      version: this.getVersion(),
      preview: this.getPreview(),
      uiVersion: this.getUiVersion()
    };
  }

  /**
   * 解析全部模块数据
   */
  getConfig(): TypeSourceConfig {
    return {
      ...this.getDescription(),
      sourceTypeList: this.getSourceTypeList(),
      moduleList: this.getModuleList()
    };
  }
}
