import path from "path";
import { URL } from "url";
import { RESOURCE_PROTOCOL, RESOURCE_TYPE } from "src/enum";
import fse from "fs-extra";
import type {
  TypeLayoutElement,
  TypeResPageConfig,
  TypeLayoutImageElement,
  TypeLayoutTextElement,
  TypeResDefinition,
  TypeResUrlData
} from "src/types/resource";
import {
  ElementLayoutConfig,
  LayoutImageElement,
  ResPageConfig,
  LayoutTextElement,
  ResourceUrlData,
  XmlValueData,
  ResImageDefinition,
  ResXmlValuesDefinition
} from "src/data/ResourceConfig";
import {
  filenameIsImage,
  filenameIsXml,
  getImageData
} from "src/common/utils/index";
import RegexpUtil from "src/common/utils/RegexpUtil";
import {
  ELEMENT_TAG,
  ALIGN_VALUE,
  ALIGN_V_VALUE,
  FILE_TYPE
} from "src/enum/index";
import pathUtil from "server/utils/pathUtil";
import XMLNodeElement from "server/compiler/XMLNodeElement";
import ImageData from "src/data/ImageData";
import TempStringUtil from "src/common/utils/TempStringUtil";
import ImageUrlUtil from "src/common/utils/ImageUrlUtil";
import electronStore from "src/common/electronStore";
import XmlFileCompiler from "./XmlFileCompiler";
import XmlTemplate from "./XmlTemplate";

export default class PageConfigCompiler extends XMLNodeElement {
  private configFile: string;
  private resourceNamespace: string;
  private pageNamespace: string;
  private pageConfig: string;
  private resourceRoot: string;
  // private resDefinitionInstance: ResourceDefinitionCompiler;
  private urlDataMap: Map<string, TypeResUrlData>;
  private resourceKeyValMap: Map<string, string>;
  constructor(data: { namespace: string; config: string }) {
    const file = path.join(
      pathUtil.RESOURCE_CONFIG_DIR,
      data.namespace,
      data.config
    );
    super(new XmlFileCompiler(file).getElement());
    this.configFile = file;
    this.resourceNamespace = path.normalize(data.namespace);
    this.pageNamespace = path.dirname(data.config);
    this.pageConfig = path.normalize(data.config);
    this.resourceRoot = path.join(pathUtil.RESOURCE_CONFIG_DIR, data.namespace);
    this.urlDataMap = new Map();
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
    attribute: "version" | "description" | "screenWidth"
  ): string {
    return this.getFirstChildNode().getAttributeOf(attribute);
  }

  getVersion(): string {
    return this.getRootAttribute("version");
  }

  getDescription(): string {
    return this.getRootAttribute("description");
  }

  getScreenWidth(): string {
    return this.getRootAttribute("screenWidth");
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
      this.relativePagePath(item.getAttributeOf("src"))
    );
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
  private getSourceUrlData(url: string): TypeResUrlData {
    const resUrlData = new ResourceUrlData();
    if (!url) return resUrlData.create();

    // 读取缓存
    const urlDataCache = this.urlDataMap.get(url);
    if (urlDataCache) return urlDataCache;

    // 解析 url 数据
    const urlData = new URL(url);
    const { hostname, pathname, searchParams } = urlData;
    const protocol = urlData.protocol.replace(/:$/, "");
    const src = path.join(hostname, pathname);
    const query: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      query[key] = value;
    });
    resUrlData.set("extname", path.extname(src));
    resUrlData.set("source", url);
    resUrlData.set("query", query);
    resUrlData.set("src", src);

    // 协议
    switch (protocol) {
      case RESOURCE_PROTOCOL.FILE:
      case RESOURCE_PROTOCOL.PROJECT:
      case RESOURCE_PROTOCOL.RELATIVE:
      case RESOURCE_PROTOCOL.RESOURCE:
      case RESOURCE_PROTOCOL.SRC: {
        resUrlData.set("protocol", protocol);
        break;
      }
      default: {
        resUrlData.set("protocol", RESOURCE_PROTOCOL.UNKNOWN);
      }
    }

    // 根据协议处理资源路径
    let srcpath = "";
    switch (protocol) {
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
        srcpath = this.resolvePagePath(src);
        break;
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
        srcpath = this.resolveResourcePath(src);
        break;
      }
      case RESOURCE_PROTOCOL.PROJECT: {
        srcpath = this.resolveProjectPath(src);
        break;
      }
    }
    resUrlData.set("srcpath", srcpath);

    // 图片
    if (filenameIsImage(srcpath)) {
      const imageData = new ImageData();
      if (fse.existsSync(srcpath)) {
        imageData.setBatch(getImageData(srcpath));
      }
      resUrlData.set("data", imageData.create());
      resUrlData.set("fileType", FILE_TYPE.IMAGE);
    }
    // xml 中的值
    else if (filenameIsXml(srcpath)) {
      // url 中的 name 参数作为查找 xml 中数据的依据
      // TODO： 先固定使用 name，后续看需求是否需要自定义其他属性去 xml 中查找
      const valueName = query["name"] || "";
      const defaultValue = new XmlTemplate(
        XmlFileCompiler.from(srcpath).getElement()
      ).getTextByAttrNameVal(valueName);
      const xmlValueData = new XmlValueData()
        .set("valueName", valueName)
        .set("defaultValue", defaultValue)
        .create();
      resUrlData.set("data", xmlValueData);
      resUrlData.set("fileType", FILE_TYPE.XML);
    } else {
      // TODO 其他文件
    }
    // 写入缓存
    const data = resUrlData.create();
    this.urlDataMap.set(url, data);
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
      .set("w", node.getAttributeOf("w", size?.width || "100"))
      .set("h", node.getAttributeOf("h", size?.height || "100"))
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
  private imageElement(node: XMLNodeElement): TypeLayoutImageElement {
    // 从 Resource 标签中读取 src 同名的 name 对应的 value
    const sourceData = this.getSourceUrlData(node.getAttributeOf("src"));
    const size =
      sourceData.fileType === FILE_TYPE.IMAGE
        ? {
            width: String(sourceData.data.width),
            height: String(sourceData.data.height)
          }
        : { width: "", height: "" };
    return new LayoutImageElement()
      .set("protocol", sourceData.protocol)
      .set("src", sourceData.src)
      .set("url", ImageUrlUtil.getUrl(sourceData.srcpath))
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
   * ->
   * ```json
   * {
   *   "tag": "Image",
   *   "name": "com.android.contacts.activities.TwelveKeyDialer",
   *   "description": "拨号",
   *   "data": {
   *       "defaultValue": "file://icons/res/com.android.contacts.activities.TwelveKeyDialer.png",
   *       "valueName": "",
   *       "src": "icons/res/com.android.contacts.activities.TwelveKeyDialer.png"
   *   }
   * }
   * ```
   * @param node
   * @returns
   */
  private textElement(node: XMLNodeElement): TypeLayoutTextElement {
    const text = node.getAttributeOf("text");
    const color = node.getAttributeOf("color");
    const sourceData = this.getSourceUrlData(color);
    const layout = this.layoutConf(node);
    const layoutTextElement = new LayoutTextElement()
      .set("protocol", sourceData.protocol)
      .set("text", text)
      .setBatchOf("layout", layout);
    if (sourceData.fileType === FILE_TYPE.XML) {
      layoutTextElement.set("color", sourceData.data.defaultValue);
    }
    return layoutTextElement.create();
  }

  // 解析 Resource 定义数据
  getResourceList(): TypeResDefinition[] {
    return this.getRootChildrenNodesByTagname(ELEMENT_TAG.Resource)
      .map(node => {
        const name = node.getAttributeOf("name");
        const source = node.getAttributeOf("source");
        const type = node.getAttributeOf<RESOURCE_TYPE>("type");
        const sourceData = this.getSourceUrlData(source);
        this.resourceKeyValMap.set(name, source);
        // 解析 sourceUrl 信息
        if (type === RESOURCE_TYPE.IMAGE) {
          const imageDefinition = new ResImageDefinition()
            .set("resType", type)
            .set("desc", node.getAttributeOf("description"))
            .set("name", name)
            .set("url", ImageUrlUtil.getUrl(sourceData.srcpath))
            .set("source", source);
          if (sourceData.fileType === FILE_TYPE.IMAGE)
            imageDefinition.set("sourceData", sourceData);
          return imageDefinition.create();
        }
        if (type === RESOURCE_TYPE.XML_VALUE) {
          console.log(node);
          const items = node.getChildrenNodes().flatMap((item, key, arr) => {
            if (item.isComment()) return [];
            return {
              tag: item.getTagname(),
              name: item.getAttributeOf("name"),
              desc: arr[key - 1]?.getComment() || ""
            };
          });
          const xmlValDefinition = new ResXmlValuesDefinition()
            .set("resType", node.getAttributeOf("type"))
            .set("desc", node.getAttributeOf("description"))
            .set("name", name)
            .set("source", source)
            .set("items", items);
          if (sourceData.fileType === FILE_TYPE.XML)
            xmlValDefinition.set("sourceData", sourceData);
          return xmlValDefinition.create();
        }
        return null;
      })
      .flatMap(item => item || []);
  }

  /**
   * 获取布局元素对应的解析数据列表
   * @returns
   */
  getLayoutElementList(): TypeLayoutElement[] {
    return this.getFirstChildNode()
      .getFirstChildNodeByTagname(ELEMENT_TAG.Layout)
      .getChildrenNodes()
      .flatMap(node => {
        // 处理指定属性字符串模板
        const resolveStrWithAttr = (attr: string) => {
          const replaced = TempStringUtil.replace(
            node.getAttributeOf(attr),
            this.resourceKeyValMap
          );
          node.setAttributeOf(attr, replaced);
        };
        switch (node.getTagname()) {
          case ELEMENT_TAG.Image: {
            resolveStrWithAttr("src");
            return this.imageElement(node);
          }
          case ELEMENT_TAG.Text: {
            resolveStrWithAttr("color");
            return this.textElement(node);
          }
          default: {
            return [];
          }
        }
      });
  }

  getResPathList(): string[] {
    return this.getResourceList()
      .map(item => item.sourceData?.src)
      .flatMap(item => item || []);
  }

  getData(): TypeResPageConfig {
    return new ResPageConfig()
      .set("config", this.pageConfig)
      .set("version", this.getVersion())
      .set("description", this.getDescription())
      .set("screenWidth", this.getScreenWidth())
      .set("previewList", this.getPreviewList())
      .set("resourceList", this.getResourceList())
      .set("layoutElementList", this.getLayoutElementList())
      .create();
  }
}
