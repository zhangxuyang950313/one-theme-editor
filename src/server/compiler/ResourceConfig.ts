import path from "path";
import { v4 as UUID } from "uuid";
import {
  TypeResourceConfig,
  TypeModuleConfig,
  TypePageOption,
  TypeResourceOption
} from "src/types/resource.config";
import ResourceConfigData, {
  ResourceOption,
  ModuleConfig,
  PageOption,
  UiVersion
} from "src/data/ResourceConfig";
import { TypeUiVersion } from "src/types/project";
import { ELEMENT_TAG } from "src/enum";
import pathUtil from "server/utils/pathUtil";
import PageConfigCompiler from "./PageConfig";
import XMLNodeBase from "./XMLNodeElement";
import XmlFileCompiler from "./XmlFileCompiler";

/**
 * 解析 配置模板的配置文件 ResourceConfig.src
 * ```xml
 * <ResourceConfig src="xiaomi/miui12/description.xml"/>
 * ```
 */
export default class ResourceConfigCompiler extends XmlFileCompiler {
  // xiaomi/miui12
  private namespace: string;
  constructor(pathname: string) {
    super(path.join(pathUtil.RESOURCE_CONFIG_DIR, pathname));
    this.namespace = path.relative(
      pathUtil.RESOURCE_CONFIG_DIR,
      path.dirname(this.getDescFile())
    );
  }

  static from(pathname: string): ResourceConfigCompiler {
    return new ResourceConfigCompiler(pathname);
  }

  // 处理成模板根目录
  private resolvePath(src: string): string {
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
    return super.getFirstChildNode().getAttributeOf("name");
  }

  // 版本
  getVersion(): string {
    return super.getFirstChildNode().getAttributeOf("version");
  }

  // 预览图
  getPreviewPic(): string {
    // TODO: 默认预览图
    return path.normalize(
      super
        .getFirstChildNode()
        .getFirstChildNodeByTagname(ELEMENT_TAG.Preview)
        .getAttributeOf("src")
    );
  }

  // UI信息
  getUiVersion(): TypeUiVersion {
    const uiVersionNode = super
      .getFirstChildNode()
      .getFirstChildNodeByTagname(ELEMENT_TAG.UiVersion);
    return new UiVersion()
      .set("name", uiVersionNode.getAttributeOf("name"))
      .set("code", uiVersionNode.getAttributeOf("code"))
      .create();
  }

  // 页面配置列表
  getPageList(pageNodeList: XMLNodeBase[]): TypePageOption[] {
    // 这里是在选择模板版本后得到的目标模块目录
    return pageNodeList.map(node => {
      const src = node.getAttributeOf("src");
      const previewList = new PageConfigCompiler({
        namespace: this.namespace,
        config: src
      }).getPreviewList();
      return new PageOption()
        .set("key", UUID())
        .set("name", node.getAttributeOf("name"))
        .set("preview", previewList[0] || "")
        .set("src", path.normalize(src))
        .create();
    });
  }

  // // 页面分组数据
  // getPageGroupList(groupNodeList: XMLNodeBase[]): TypeResPageGroup[] {
  //   return groupNodeList.map(groupNode => {
  //     const pageList = this.getPageList(
  //       groupNode.getChildrenNodesByTagname(ELEMENT_TAG.Page)
  //     );
  //     return new ResPageGroup()
  //       .set("name", groupNode.getAttributeOf("name"))
  //       .set("pageList", pageList)
  //       .create();
  //   });
  // }

  // 模块配置数据
  getModuleList(): TypeModuleConfig[] {
    return super
      .getFirstChildNode()
      .getChildrenNodesByTagname(ELEMENT_TAG.Module)
      .map((moduleNode, index) => {
        const pageList = this.getPageList(
          moduleNode.getChildrenNodesByTagname(ELEMENT_TAG.Page)
        );
        return new ModuleConfig()
          .set("index", index)
          .set("name", moduleNode.getAttributeOf("name"))
          .set("icon", path.normalize(moduleNode.getAttributeOf("icon")))
          .set("pageList", pageList)
          .create();
      });
  }

  /**
   * 解析配置信息
   * 只解析 description.xml 不需要进一步解析页面
   */
  getOption(): TypeResourceOption {
    return new ResourceOption()
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
   * 解析全部配置数据
   */
  getConfig(): TypeResourceConfig {
    return new ResourceConfigData().create({
      ...this.getOption(),
      moduleList: this.getModuleList()
    });
  }
}
