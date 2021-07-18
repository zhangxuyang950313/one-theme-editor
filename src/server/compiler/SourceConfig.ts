import path from "path";
import { ELEMENT_TAG } from "src/enum";
import fse from "fs-extra";
import { v4 as UUID } from "uuid";
import {
  TypeSourceConfigData,
  TypeSourceModuleConf,
  TypeSourcePageGroupConf,
  TypeSourcePageConf,
  TypeSourceConfigInfo,
  TypeSourceTypeConf
} from "types/source-config";
import { TypeBrandConf, TypeProjectUiVersion } from "types/project";
import {
  SourceConfigInfo,
  SourceModuleConf,
  SourcePageConf,
  SourcePageGroupConf,
  SourceTypeConf,
  UiVersion
} from "data/SourceConfig";
import PATHS from "server/utils/pathUtils";
import ERR_CODE from "common/errorCode";
import PageConfig from "./PageConfig";
import XMLNodeBase from "./XMLNodeElement";
import BaseCompiler from "./BaseCompiler";

// 解析 sourceConfig xml 配置文件
export default class SourceConfig extends BaseCompiler {
  // xiaomi/miui12
  private namespace: string;
  constructor(pathname: string) {
    super(path.join(PATHS.SOURCE_CONFIG_DIR, pathname));
    this.namespace = path.relative(
      PATHS.SOURCE_CONFIG_DIR,
      path.dirname(this.getDescFile())
    );
  }

  // 读取厂商配置
  static readBrandConf(): TypeBrandConf[] {
    if (!fse.existsSync(PATHS.SOURCE_CONFIG_FILE)) {
      throw new Error(ERR_CODE[4003]);
    }
    return fse.readJsonSync(PATHS.SOURCE_CONFIG_FILE);
  }

  /**
   * 解析当前厂商下所有配置信息
   * @param brandType 厂商 type
   * @returns
   */
  static getSourceConfigInfoList(brandType: string): TypeSourceConfigInfo[] {
    const brandConfList = this.readBrandConf();
    const brandConf = brandConfList.find(item => item.type === brandType);
    if (!brandConf?.sourceConfigs) return [];
    const existsConfigs = brandConf.sourceConfigs.filter(item =>
      fse.existsSync(path.join(PATHS.SOURCE_CONFIG_DIR, item))
    );
    return existsConfigs.map(configUrl =>
      new SourceConfig(configUrl).getInfo()
    );
  }

  // 处理成模板根目录
  private resolveSourcePath(src: string): string {
    return path.join(this.getAbsRootDir(), src);
  }

  // 处理成素材相对路径
  private relativePath(src: string): string {
    return path.join(this.namespace, src);
  }

  // private resolveSourceRoot(url: string): string {
  //   return path.join(this.rootDir, url);
  // }

  getAbsRootDir(): string {
    return path.dirname(this.getDescFile());
  }

  getDescFile(): string {
    return this.getFile();
  }

  // 名称
  getName(): string {
    return super.getRootNode().getAttributeOf("name");
  }

  // 版本
  getVersion(): string {
    return super.getRootNode().getAttributeOf("version");
  }

  // 预览图
  getPreview(): string {
    // TODO: 默认预览图
    return path.normalize(
      super.getRootFirstChildNodeOf(ELEMENT_TAG.PREVIEW).getAttributeOf("src")
    );
  }

  // UI信息
  getUiVersion(): TypeProjectUiVersion {
    const uiVersionNode = super.getRootFirstChildNodeOf(ELEMENT_TAG.UI_VERSION);
    return new UiVersion()
      .set("name", uiVersionNode.getAttributeOf("name"))
      .set("code", uiVersionNode.getAttributeOf("code"))
      .create();
  }

  // 素材类型定义列表
  getSourceTypeList(): TypeSourceTypeConf[] {
    return super
      .getRootChildrenNodesOf(ELEMENT_TAG.SOURCE)
      .map(item =>
        new SourceTypeConf()
          .set("tag", item.getAttributeOf("tag"))
          .set("name", item.getAttributeOf("name"))
          .set("sourceType", item.getAttributeOf("type"))
          .create()
      );
  }

  // 页面配置列表
  getPageList(pageNodeList: XMLNodeBase[]): TypeSourcePageConf[] {
    // 这里是在选择模板版本后得到的目标模块目录
    return pageNodeList.map(node => {
      const src = node.getAttributeOf("src");
      const previewList = new PageConfig({
        namespace: this.namespace,
        config: src
      }).getPreviewList();
      return new SourcePageConf()
        .set("key", UUID())
        .set("name", node.getAttributeOf("name"))
        .set("preview", previewList[0] || "")
        .set("src", path.normalize(src))
        .create();
    });
  }
  // E:\\one-theme-editor\\static\\resource\\sourceConfig\\xiaomi\\miui12\\wallpaper\\desktop.xml

  // 页面分组数据
  getPageGroupList(groupNodeList: XMLNodeBase[]): TypeSourcePageGroupConf[] {
    return groupNodeList.map(groupNode => {
      const pageList = this.getPageList(
        groupNode.getChildrenNodesByTagname(ELEMENT_TAG.PAGE)
      );
      return new SourcePageGroupConf()
        .set("name", groupNode.getAttributeOf("name"))
        .set("pageList", pageList)
        .create();
    });
  }

  // 模块配置数据
  getModuleList(): TypeSourceModuleConf[] {
    return super
      .getRootChildrenNodesOf(ELEMENT_TAG.MODULE)
      .map((moduleNode, index) => {
        const groupList = this.getPageGroupList(
          moduleNode.getChildrenNodesByTagname(ELEMENT_TAG.GROUP)
        );
        return new SourceModuleConf()
          .set("index", index)
          .set("name", moduleNode.getAttributeOf("name"))
          .set("icon", path.normalize(moduleNode.getAttributeOf("icon")))
          .set("groupList", groupList)
          .create();
      });
  }

  /**
   * 解析配置配置的简略信息
   * 只解析 description.xml 不需要进一步解析页面
   */
  getInfo(): TypeSourceConfigInfo {
    return new SourceConfigInfo()
      .set("key", UUID())
      .set("root", this.namespace)
      .set("config", path.basename(this.getDescFile()))
      .set("name", this.getName())
      .set("version", this.getVersion())
      .set("preview", this.getPreview())
      .set("uiVersion", this.getUiVersion())
      .create();
  }

  /**
   * 解析全部模块数据
   */
  getConfig(): TypeSourceConfigData {
    return {
      ...this.getInfo(),
      sourceTypeList: this.getSourceTypeList(),
      moduleList: this.getModuleList()
    };
  }
}
