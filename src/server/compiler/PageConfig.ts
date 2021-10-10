import path from "path";
import { URL } from "url";
import fse from "fs-extra";
import mimeTypes from "mime-types";
import type {
  TypeResourceDefinition,
  TypeLayoutElement,
  TypeLayoutImageElement,
  TypeLayoutTextElement,
  TypeSourceData,
  TypeFileBlock,
  TypeXmlTypeBlock,
  TypeXmlTypeTags
} from "src/types/resource.page";
import { TypePageConfig } from "src/types/resource.config";
import { TypeImageData } from "src/types/project";
import {
  ElementLayoutConfig,
  LayoutImageElement,
  LayoutTextElement,
  PageConfig,
  SourceData,
  ImageItem,
  ResourceDefinition,
  FileBlock,
  XmlItem,
  XmlTypeBlock,
  XmlValueItem
} from "src/data/ResourceConfig";
import {
  filenameIsImage,
  filenameIsXml,
  getFileSize,
  getImageData
} from "src/common/utils/index";
import RegexpUtil from "src/common/utils/RegexpUtil";
import {
  ELEMENT_TAG,
  ALIGN_VALUE,
  ALIGN_V_VALUE,
  RESOURCE_TAG,
  RESOURCE_PROTOCOL,
  LAYOUT_ELEMENT_TAG
} from "src/enum/index";
import pathUtil from "server/utils/pathUtil";
import XMLNodeElement from "server/compiler/XMLNodeElement";
import ImageData from "src/data/ImageData";
import TempStringUtil from "src/common/utils/TempStringUtil";
import electronStore from "src/common/electronStore";
import XmlFileCompiler from "./XmlFileCompiler";
import XmlTemplate from "./XmlTemplate";

export default class PageConfigCompiler extends XMLNodeElement {
  private configFile: string;
  private pageNamespace: string;
  private pageConfig: string;
  private resourceRoot: string;
  private urlDataCache: Map<string, TypeSourceData>;
  private imageDataCache: Map<string, TypeImageData>;
  private resourceKeyValMap: Map<string, string>;
  constructor(data: { namespace: string; config: string }) {
    const file = path.join(
      pathUtil.RESOURCE_CONFIG_DIR,
      data.namespace,
      data.config
    );
    super(new XmlFileCompiler(file).getElement());
    this.configFile = file;
    this.pageNamespace = path.dirname(data.config);
    this.pageConfig = path.normalize(data.config);
    this.resourceRoot = path.join(pathUtil.RESOURCE_CONFIG_DIR, data.namespace);
    this.urlDataCache = new Map();
    this.imageDataCache = new Map();
    this.resourceKeyValMap = new Map();
  }

  /**
   * 获取根节点的第一个 {tagname} 节点
   * @param tagname
   * @returns
   */
  private getRootFirstChildNodeByTagname(tagname: string): XMLNodeElement {
    return this.getFirstChildNode().getFirstChildNodeByTagname(tagname);
  }

  /**
   * 获取根节点所有 {tagname} 节点
   * @param tagname
   * @returns
   */
  public getRootChildrenNodesByTagname(tagname: string): XMLNodeElement[] {
    return this.getFirstChildNode().getChildrenNodesByTagname(tagname);
  }

  // 生成当前配置中相对于素材根路径的绝对路径
  private resolveResourcePath(pathname: string): string {
    return path.join(this.resourceRoot, pathname);
  }

  private resolveProjectPath(pathname: string): string {
    return path.join(electronStore.get("projectData").root, pathname);
  }

  // 相对于当前页面目录的路径转为正确的绝对路径
  private resolvePagePath(pathname: string): string {
    return path.join(path.dirname(this.configFile), pathname);
  }

  private resolveProtocolPath(src: string): string {
    let urlData = new URL("unknown://");
    try {
      urlData = new URL(src);
    } catch (err) {
      console.error(err);
    }
    const file = path.join(urlData.hostname, urlData.pathname);
    // 根据协议处理资源路径
    switch (urlData.protocol.replace(/:$/, "")) {
      /**
       * relative 协议，相对当前配置路径
       * ```json
       * {
       *   "source": "relative://../icons/res/drawable-xxhdpi/com.android.contacts.activities.TwelveKeyDialer.png",
       *   "src": "../icons/res/drawable-xxhdpi/com.android.contacts.activities.TwelveKeyDialer.png",
       *   "url": "http://127.0.0.1:8000/image?filepath=/Users/zhangxuyang/mine/javascript/one-theme-editor/static/resource/config/xiaomi/miui12/icons/res/drawable-xxhdpi/com.android.contacts.activities.TwelveKeyDialer.png&t=1633421373933"
       * }
       *
       * ```
       */
      case RESOURCE_PROTOCOL.RELATIVE: {
        return this.resolvePagePath(file);
      }
      /**
       * resource 协议，相对资源配置根路径
       * ```json
       * {
       *   "source": "resource://icons/res/drawable-xxhdpi/com.android.contacts.activities.TwelveKeyDialer.png",
       *   "src": "icons/res/drawable-xxhdpi/com.android.contacts.activities.TwelveKeyDialer.png",
       *   "url": "http://127.0.0.1:8000/image?filepath=/Users/zhangxuyang/mine/javascript/one-theme-editor/static/resource/config/xiaomi/miui12/icons/res/drawable-xxhdpi/com.android.contacts.activities.TwelveKeyDialer.png&t=1633421373934"
       * }
       *
       * ```
       */
      case RESOURCE_PROTOCOL.SRC: // src 为资源和工程双向协议，但要生成一个资源的 url
      case RESOURCE_PROTOCOL.RESOURCE: {
        return this.resolveResourcePath(file);
      }
      case RESOURCE_PROTOCOL.PROJECT: {
        return this.resolveProjectPath(file);
      }
      default: {
        return "";
      }
    }
  }

  // 处理当前页面资源的相对路径
  private relativeResourcePath(pathname: string): string {
    const relative = path.relative(
      pathUtil.RESOURCE_CONFIG_DIR,
      path.dirname(this.configFile)
    );
    return path.join(relative, pathname);
  }

  // 当前页面资源相对于当前素材根路径
  private relativePagePath(pathname: string): string {
    return path.join(this.pageNamespace, pathname);
  }

  // private resolveRelativePath(pathname: string): string {
  //   const relative = path.relative(
  //     this.resourceNamespace,
  //     path.dirname(this.configFile)
  //   );
  //   return path.join(relative, pathname);
  // }

  /**
   * 获取形如字符串 ${name} 中的 name 值
   * @param str
   * @returns
   */
  private getPlaceholderName(str: string): string {
    const execResult = RegexpUtil.placeholderRegexp.exec(str);
    return execResult?.[1] || "";
  }

  // /**
  //  * 处理当前页面中定义以配置路径为根路径的路径
  //  * ```xml
  //  * <!-- 定义一下 src 的文件路径在 wallpaper/ 下 ->
  //  * <tag src="wallpaper/value.xml"/>
  //  * ```
  //  */
  // private relativeSourceRootPath(pathname: string): string {
  //   const relative = path.relative(pathname, path.dirname(pathname));
  //   return this.relativePath(path.join(relative, pathname));
  // }

  private getRootAttribute(
    attribute: "version" | "name" | "screenWidth" | "disableTab"
  ): string {
    return this.getFirstChildNode().getAttributeOf(attribute);
  }

  getVersion(): string {
    return this.getRootAttribute("version");
  }

  getPageName(): string {
    return this.getRootAttribute("name");
  }

  getScreenWidth(): string {
    return this.getRootAttribute("screenWidth");
  }

  getDisableTabs(): boolean {
    return this.getRootAttribute("disableTab") === "true";
  }

  /**
   * ```xml
   * <!-- 静态预览图 -->
   * <Preview src="../preview/preview.jpg"/>
   * ```
   * @returns
   */
  getPreviewList(): string[] {
    return this.getRootChildrenNodesByTagname(ELEMENT_TAG.Preview).map(item =>
      item.getAttributeOf("src")
    );
  }

  private getImageData(file: string): TypeImageData {
    const cache = this.imageDataCache.get(file);
    return cache || getImageData(file);
  }

  // // 获取定义的资源配置数据
  // private getResDefinitionByName(srcVal: string): TypeResDefinition | null {
  //   const placeholder = this.getPlaceholderName(srcVal);
  //   return this.resDefinitionInstance.getResDefinitionByName(placeholder);
  // }

  /**
   * 解析 url 包含的信息
   * @param url
   * src://wallpaper/default_wallpaper.jpg
   * src://com.miui.home/theme_values.xml?tag=color&amp;name=icon_title_text
   * @returns
   */
  private getUrlSourceData(url: string): TypeSourceData {
    const urlSourceData = new SourceData();
    if (!url) return urlSourceData.create();

    // 读取缓存
    const urlDataCache = this.urlDataCache.get(url);
    if (urlDataCache) return urlDataCache;

    // 解析 url 数据
    let urlData: URL = new URL("unknown://");
    try {
      urlData = new URL(url);
    } catch (err) {
      console.error(err);
    }
    const { hostname, pathname, searchParams } = urlData;
    const protocol = urlData.protocol.replace(/:$/, "");
    const src = path.join(hostname, pathname);
    const query: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      query[key] = value;
    });
    const fileType = mimeTypes.lookup(src) || "";
    urlSourceData.set("fileType", fileType);
    urlSourceData.set("extname", path.extname(src));
    urlSourceData.set("query", query);
    urlSourceData.set("src", src);

    // 协议
    urlSourceData.set("protocol", "");
    switch (protocol) {
      case RESOURCE_PROTOCOL.FILE:
      case RESOURCE_PROTOCOL.PROJECT:
      case RESOURCE_PROTOCOL.RELATIVE:
      case RESOURCE_PROTOCOL.RESOURCE:
      case RESOURCE_PROTOCOL.SRC: {
        urlSourceData.set("protocol", protocol);
        break;
      }
    }
    // 根据协议处理资源路径
    const file = this.resolveProtocolPath(url);
    if (fse.existsSync(file)) {
      urlSourceData.set("size", getFileSize(file));
    }

    // 图片
    if (filenameIsImage(file)) {
      const imageData = new ImageData();
      if (fse.existsSync(file)) {
        imageData.setBatch(this.getImageData(file));
      }
      // urlSourceData.set("extra", imageData.create());
    }
    // xml 中的值
    else if (filenameIsXml(file)) {
      // url 中的 name 参数作为查找 xml 中数据的依据
      // TODO： 先固定使用 name，后续看需求是否需要自定义其他属性去 xml 中查找
      const valueName = query["name"] || "";
      const value = new XmlTemplate(
        XmlFileCompiler.from(file).getElement()
      ).getTextByAttrNameVal(valueName);
      // resUrlData.set("extra", { value });
    } else {
      // TODO 其他文件
    }
    // 写入缓存
    const data = urlSourceData.create();
    this.urlDataCache.set(url, data);
    return data;
  }

  /**
   * 节点布局信息
   * @param node
   * @returns
   */
  private layoutConf(
    node: XMLNodeElement,
    size?: { width: string; height: string }
  ) {
    return new ElementLayoutConfig()
      .set("x", node.getAttributeOf("x", "0"))
      .set("y", node.getAttributeOf("y", "0"))
      .set("w", node.getAttributeOf("w", size?.width ?? "100"))
      .set("h", node.getAttributeOf("h", size?.height ?? "100"))
      .set("align", node.getAttributeOf("align", ALIGN_VALUE.LEFT))
      .set("alignV", node.getAttributeOf("alignV", ALIGN_V_VALUE.TOP))
      .create();
  }

  /**
   * 解析图片节点
   * ```xml
   * <Image
   *  name="天气图标"
   *  x="0" y="0" w="100" h="100" align="center" alignV="center"
   *  src="${name}"
   * />
   * ```
   * @param node
   * @returns
   */
  private layoutImageElement(node: XMLNodeElement): TypeLayoutImageElement {
    const source = node.getAttributeOf("src");
    // 从 Resource 标签中读取 src 同名的 name 对应的 value
    const sourceData = this.getUrlSourceData(source);
    const imageData = { width: "0", height: "0" };
    try {
      this.getImageData(this.resolveResourcePath(sourceData.src));
    } catch (err) {
      //
    }
    const size = {
      width: String(imageData.width),
      height: String(imageData.height)
    };
    return new LayoutImageElement()
      .set("source", source)
      .set("sourceData", sourceData)
      .set("layout", this.layoutConf(node, size))
      .create();
  }

  /**
   * 解析值节点
   * ```xml
   * <Text
   *     text="拨号"
   *     x="415" y="1250" size="36" align="center" alignV="center"
   *     color="${icon_title_text}"
   * />
   * ```
   * @param node
   * @returns
   */
  private layoutTextElement(node: XMLNodeElement): TypeLayoutTextElement {
    return new LayoutTextElement()
      .set("text", node.getAttributeOf("text"))
      .set("size", node.getAttributeOf("size"))
      .set("color", node.getAttributeOf("color"))
      .setBatchOf("layout", this.layoutConf(node))
      .create();
  }

  private getImageBlock(node: XMLNodeElement, rootKey: string): TypeFileBlock {
    const imageKey = node.getAttributeOf("key");
    const imageItems = node.getChildrenNodes().flatMap((item, key, arr) => {
      // 不接受非 Item 节点
      if (item.getTagname() !== ELEMENT_TAG.Item) return [];
      const itemKey = item.getAttributeOf("key");
      const source = item.getAttributeOf("src");
      const sourceData = this.getUrlSourceData(source);
      this.resourceKeyValMap.set(`${rootKey}/${imageKey}/${itemKey}`, source);
      return new ImageItem()
        .set("key", itemKey)
        .set("comment", arr[key - 1]?.getComment())
        .set("source", source)
        .set("sourceData", sourceData)
        .create();
    });
    return new FileBlock()
      .set("key", imageKey)
      .set("name", node.getAttributeOf("name"))
      .set("items", imageItems)
      .create();
  }

  // xml 类型的块
  private getXmlTypeBlock(
    node: XMLNodeElement,
    tag: TypeXmlTypeTags,
    rootKey: string
  ): TypeXmlTypeBlock {
    const xmlItemKey = node.getAttributeOf("key");
    const xmlItems = node.getChildrenNodes().flatMap((item, k, arr) => {
      // 不接受非 Xml 节点
      if (item.getTagname() !== ELEMENT_TAG.Xml) return [];
      const itemKey = item.getAttributeOf("key");
      const source = item.getAttributeOf("src");
      const sourceData = this.getUrlSourceData(source);
      const valueItems = item
        .getChildrenNodes()
        .flatMap((XmlChild, kk, arr) => {
          if (!XmlChild.isElement()) return [];
          return new XmlValueItem()
            .set("tag", XmlChild.getTagname())
            .set("comment", arr[kk - 1]?.getComment())
            .set("attributes", XmlChild.getAttributeEntries())
            .create();
        });
      this.resourceKeyValMap.set(`${rootKey}/${xmlItemKey}/${itemKey}`, source);
      return new XmlItem()
        .set("tag", item.getTagname())
        .set("key", itemKey)
        .set("name", item.getAttributeOf("name"))
        .set("source", source)
        .set("sourceData", sourceData)
        .set("items", valueItems)
        .create();
    });
    return new XmlTypeBlock()
      .set("tag", tag)
      .set("key", xmlItemKey)
      .set("name", node.getAttributeOf("name"))
      .set("items", xmlItems)
      .create();
  }

  // 解析 Resource 定义数据
  getResourceList(): TypeResourceDefinition[] {
    return this.getRootChildrenNodesByTagname(ELEMENT_TAG.Resource).map(
      Resource => {
        const key = Resource.getAttributeOf("key");
        const resource = new ResourceDefinition()
          .set("key", key)
          .set("name", Resource.getAttributeOf("name"));
        const children = Resource.getChildrenNodes().flatMap(item => {
          const tag = item.getTagname<RESOURCE_TAG>();
          switch (tag) {
            // 图片类型资源
            case RESOURCE_TAG.File: {
              return this.getImageBlock(item, key);
            }
            // xml 值类型资源
            case RESOURCE_TAG.String:
            case RESOURCE_TAG.Number:
            case RESOURCE_TAG.Color:
            case RESOURCE_TAG.Boolean: {
              return this.getXmlTypeBlock(item, tag, key);
            }
            default: {
              return [];
            }
          }
        });
        resource.set("children", children);
        return resource.create();
      }
    );
  }

  /**
   * 获取布局元素对应的解析数据列表
   * @returns
   */
  getLayoutElementList(): TypeLayoutElement[] {
    return this.getFirstChildNode()
      .getFirstChildNodeByTagname(LAYOUT_ELEMENT_TAG.Layout)
      .getChildrenNodes()
      .flatMap(node => {
        // 处理指定属性字符串模板
        // 返回是否替换成功
        const resolveTempStrWithAttr = (attr: string) => {
          const replaced = TempStringUtil.replace(
            node.getAttributeOf(attr),
            this.resourceKeyValMap
          );
          node.setAttributeOf(attr, replaced);
          return !!replaced;
        };
        switch (node.getTagname()) {
          case LAYOUT_ELEMENT_TAG.Image: {
            if (!resolveTempStrWithAttr("src")) return [];
            return this.layoutImageElement(node);
          }
          case LAYOUT_ELEMENT_TAG.Text: {
            if (!resolveTempStrWithAttr("color")) return [];
            return this.layoutTextElement(node);
          }
          default: {
            return [];
          }
        }
      });
  }

  /**
   * @deprecated
   * @returns
   */
  getResPathList(): string[] {
    return this.getResourceList().map(item => {
      return item.key;
      // if (item.resType === RESOURCE_TAG.Image) {
      //   // item.items.forEach(o => {
      //   // prev.push(o.sourceData.src);
      //   // });
      // }
      // if (item.resType === RESOURCE_TAG.Color) {
      //   prev.push(item.sourceData.src);
      // }
    });
  }

  getData(): TypePageConfig {
    return new PageConfig()
      .set("config", this.pageConfig)
      .set("version", this.getVersion())
      .set("name", this.getPageName())
      .set("screenWidth", this.getScreenWidth())
      .set("disableTabs", this.getDisableTabs())
      .set("previewList", this.getPreviewList())
      .set("resourceList", this.getResourceList())
      .set("layoutElementList", this.getLayoutElementList())
      .create();
  }
}
