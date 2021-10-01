import path from "path";
import { v4 as UUID } from "uuid";
import { ELEMENT_TAG } from "src/enum";
import {
  TypeResourceConfig,
  TypeResModule,
  TypeResPageGroup,
  TypeResPageOption,
  TypeResourceOption,
  TypeResType
} from "src/types/resource";
import {
  ResourceOption,
  ResourceModuleConf,
  ResourcePageOption,
  ResourcePageGroupConf,
  ResourceTypeConf,
  UiVersion
} from "src/data/ResourceConfig";
import { TypeUiVersion } from "src/types/project";
import pathUtil from "server/utils/pathUtil";
import PageConfig from "./PageConfig";
import XMLNodeBase from "./XMLNodeElement";
import XmlFileCompiler from "./XmlFileCompiler";

// 解析 resourceConfig xml 配置文件
export default class ResourceConfig extends XmlFileCompiler {
  // xiaomi/miui12
  private namespace: string;
  constructor(pathname: string) {
    super(path.join(pathUtil.RESOURCE_CONFIG_DIR, pathname));
    this.namespace = path.relative(
      pathUtil.RESOURCE_CONFIG_DIR,
      path.dirname(this.getDescFile())
    );
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
  getUiVersion(): TypeUiVersion {
    const uiVersionNode = super.getRootFirstChildNodeOf(ELEMENT_TAG.UiVersion);
    return new UiVersion()
      .set("name", uiVersionNode.getAttributeOf("name"))
      .set("code", uiVersionNode.getAttributeOf("code"))
      .create();
  }

  // 素材类型定义列表
  getResTypeList(): TypeResType[] {
    return super
      .getRootChildrenNodesOf(ELEMENT_TAG.Resource)
      .map(item =>
        new ResourceTypeConf()
          .set("type", item.getAttributeOf("type"))
          .set("tag", item.getAttributeOf("tag"))
          .set("name", item.getAttributeOf("name"))
          .create()
      );
  }

  // 页面配置列表
  getPageList(pageNodeList: XMLNodeBase[]): TypeResPageOption[] {
    // 这里是在选择模板版本后得到的目标模块目录
    return pageNodeList.map(node => {
      const src = node.getAttributeOf("src");
      const previewList = new PageConfig({
        namespace: this.namespace,
        config: src
      }).getPreviewList();
      return new ResourcePageOption()
        .set("key", UUID())
        .set("name", node.getAttributeOf("name"))
        .set("preview", previewList[0] || "")
        .set("src", path.normalize(src))
        .create();
    });
  }

  // 页面分组数据
  getPageGroupList(groupNodeList: XMLNodeBase[]): TypeResPageGroup[] {
    return groupNodeList.map(groupNode => {
      const pageList = this.getPageList(
        groupNode.getChildrenNodesByTagname(ELEMENT_TAG.Page)
      );
      return new ResourcePageGroupConf()
        .set("name", groupNode.getAttributeOf("name"))
        .set("pageList", pageList)
        .create();
    });
  }

  // 模块配置数据
  getModuleList(): TypeResModule[] {
    return super
      .getRootChildrenNodesOf(ELEMENT_TAG.Module)
      .map((moduleNode, index) => {
        const groupList = this.getPageGroupList(
          moduleNode.getChildrenNodesByTagname(ELEMENT_TAG.Group)
        );
        return new ResourceModuleConf()
          .set("index", index)
          .set("name", moduleNode.getAttributeOf("name"))
          .set("icon", path.normalize(moduleNode.getAttributeOf("icon")))
          .set("groupList", groupList)
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
    return {
      ...this.getOption(),
      typeList: this.getResTypeList(),
      moduleList: this.getModuleList()
    };
  }
}
