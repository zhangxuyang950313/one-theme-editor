import path from "path";
import { v4 as UUID } from "uuid";
import { ELEMENT_TAG } from "src/enum";
import {
  TypeSourceConfig,
  TypeSourceModuleConf,
  TypeSourcePageGroupConf,
  TypeSourcePageConf,
  TypeSourceConfigPreview,
  TypeSourceTypeConf
} from "src/types/source";
import {
  SourceConfigInfo,
  SourceModuleConf,
  SourcePageConf,
  SourcePageGroupConf,
  SourceTypeConf,
  UiVersion
} from "src/data/SourceConfig";
import { TypeProjectUiVersion } from "src/types/project";
import pathUtil from "server/utils/pathUtil";
import PageConfig from "./PageConfig";
import XMLNodeBase from "./XMLNodeElement";
import XmlFileCompiler from "./XmlFileCompiler";

// 解析 sourceConfig xml 配置文件
export default class SourceConfig extends XmlFileCompiler {
  // xiaomi/miui12
  private namespace: string;
  constructor(pathname: string) {
    super(path.join(pathUtil.SOURCE_CONFIG_DIR, pathname));
    this.namespace = path.relative(
      pathUtil.SOURCE_CONFIG_DIR,
      path.dirname(this.getDescFile())
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
  getPreviewPic(): string {
    // TODO: 默认预览图
    return path.normalize(
      super.getRootFirstChildNodeOf(ELEMENT_TAG.Preview).getAttributeOf("src")
    );
  }

  // UI信息
  getUiVersion(): TypeProjectUiVersion {
    const uiVersionNode = super.getRootFirstChildNodeOf(ELEMENT_TAG.UiVersion);
    return new UiVersion()
      .set("name", uiVersionNode.getAttributeOf("name"))
      .set("code", uiVersionNode.getAttributeOf("code"))
      .create();
  }

  // 素材类型定义列表
  getSourceTypeList(): TypeSourceTypeConf[] {
    return super
      .getRootChildrenNodesOf(ELEMENT_TAG.Source)
      .map(item =>
        new SourceTypeConf()
          .set("tag", item.getAttributeOf("tag"))
          .set("name", item.getAttributeOf("name"))
          .set("type", item.getAttributeOf("type"))
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

  // 页面分组数据
  getPageGroupList(groupNodeList: XMLNodeBase[]): TypeSourcePageGroupConf[] {
    return groupNodeList.map(groupNode => {
      const pageList = this.getPageList(
        groupNode.getChildrenNodesByTagname(ELEMENT_TAG.Page)
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
      .getRootChildrenNodesOf(ELEMENT_TAG.Module)
      .map((moduleNode, index) => {
        const groupList = this.getPageGroupList(
          moduleNode.getChildrenNodesByTagname(ELEMENT_TAG.Group)
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
  getConfigPreview(): TypeSourceConfigPreview {
    return new SourceConfigInfo()
      .set("key", UUID())
      .set("namespace", this.namespace)
      .set("config", path.basename(this.getDescFile()))
      .set("name", this.getName())
      .set("version", this.getVersion())
      .set("preview", this.getPreviewPic())
      .set("uiVersion", this.getUiVersion())
      .create();
  }

  /**
   * 解析全部模块数据
   */
  getConfig(): TypeSourceConfig {
    return {
      ...this.getConfigPreview(),
      sourceTypeList: this.getSourceTypeList(),
      sourceModuleList: this.getModuleList()
    };
  }
}
