import path from "path";
import querystring from "querystring";
import { getImageData } from "common/utils";
import { ELEMENT_TAG, ALIGN_VALUES, ALIGN_V_VALUES } from "enum/index";
import {
  TypeSourceCopyConf,
  TypeSourceLayoutElement,
  TypeSourcePageData,
  TypeSourceImageElement,
  TypeSourceTextElement,
  TypeSourceDefineData
} from "types/source-config";
import XMLNodeElement from "server/compiler/XMLNodeElement";
import {
  ElementLayoutConf,
  DefineSourceData,
  SourceImageElement,
  SourcePageData,
  SourceTextElement
} from "data/SourceConfig";
import { placeholderRegexp } from "src/common/regexp";
import PATH from "server/utils/pathUtils";
import BaseCompiler from "./BaseCompiler";
import SourceDefine from "./SourceDefine";

export default class PageConfig extends BaseCompiler {
  private sourceNamespace: string;
  private pageNamespace: string;
  private pageConfig: string;
  private sourceRootAbsolute: string;
  private sourceDefineInstance: SourceDefine;
  constructor(data: { namespace: string; config: string }) {
    super(path.join(PATH.SOURCE_CONFIG_DIR, data.namespace, data.config));
    this.sourceNamespace = path.normalize(data.namespace);
    this.pageNamespace = path.dirname(data.config);
    this.pageConfig = path.normalize(data.config);
    this.sourceRootAbsolute = path.join(PATH.SOURCE_CONFIG_DIR, data.namespace);
    this.sourceDefineInstance = new SourceDefine(
      this.getRootFirstChildNodeOf(ELEMENT_TAG.SOURCE),
      this.sourceRootAbsolute
    );
  }

  // ${root}/path/to/somewhere -> absolute/source/root/to/somewhere
  private resolveRootSourcePath(pathname: string): string {
    // return PathResolver.parse({ root: this.sourceRootAbsolute }, pathname);
    return path.join(this.sourceRootAbsolute, pathname);
  }

  // 处理当前页面资源的相对路径
  private relativePath(pathname: string): string {
    const relative = path.relative(
      PATH.SOURCE_CONFIG_DIR,
      path.dirname(this.getFile())
    );
    return path.join(relative, pathname);
  }

  // 处理当前页面资源相对于素材根路径
  private relativeSourcePath(pathname: string): string {
    return path.join(path.dirname(this.getFile()), pathname);
  }

  // 当前页面资源相对于当前素材根路径
  private relativePagePath(pathname: string): string {
    return path.join(this.pageNamespace, pathname);
  }

  private resolveRelativePath(pathname: string): string {
    const relative = path.relative(
      this.sourceNamespace,
      path.dirname(this.getFile())
    );
    console.log({ relative });
    return path.join(relative, pathname);
  }

  /**
   * 获取形如字符串 ${name} 中的 name 值
   * @param str
   * @returns
   */
  private getPlaceholderName(str: string): string {
    const execResult = placeholderRegexp.exec(str);
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
    return this.getRootNode().getAttributeOf(attribute);
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
   * <Previews>
   *     <Preview src="../preview/preview.jpg"/>
   * </Previews>
   * ```
   * @returns
   */
  getPreviewList(): string[] {
    return super
      .getRootFirstChildNodeOf(ELEMENT_TAG.PREVIEWS)
      .getChildrenNodesByTagname(ELEMENT_TAG.PREVIEW)
      .map(item => this.relativePagePath(item.getAttributeOf("src")));
  }

  /**
   * 拷贝文件的列表
   * ```xml
   * <copy from="theme_fallback.xml" to="wallpaper/theme_fallback.xml"/>
   * <copy from="theme_fallback.xml" release="wallpaper/theme_fallback1.xml"/>
   * ```
   * @returns
   */
  getCopyConfList(): TypeSourceCopyConf[] {
    return super
      .getRootChildrenNodesOf("copy")
      .map<TypeSourceCopyConf>(node => ({
        from: node.getAttributeOf("from"),
        release: node.getAttributeOf("source")
      }));
  }

  /**
   * 从值的 query 字符串中获得对应的映射值
   * 以下表示获取“工程目录下 wallpaper/theme_values.xml 中 name=action_bar_title_text_color_light 的 text 值”
   * ```xml
   * <Text
   *  value=src=${root}/wallpaper/theme_values.xml&amp;name=action_bar_title_text_color_light
   * />
   * ```
   * @param query src=${root}/wallpaper/theme_values.xml&amp;name=action_bar_title_text_color_light
   * @returns
   */
  private getValueByQueryStr(query: string): {
    name: string;
    src: string;
  } {
    let { src, name } = querystring.parse(query);
    if (!src || !name) {
      console.debug("query错误", query);
      return { name: "", src: "" };
    }
    // 如果有多个参数取第一个
    if (Array.isArray(src)) src = src[0];
    if (Array.isArray(name)) name = name[0];
    return { name, src };
  }

  // 获取定义的资源配置数据
  private getSourceDefineByName(srcVal: string): TypeSourceDefineData | null {
    const pName = this.getPlaceholderName(srcVal);
    return this.sourceDefineInstance.getSourceDefineByName(pName);
  }

  /**
   * 节点布局信息
   * @param node
   * @returns
   */
  private layoutConf(node: XMLNodeElement) {
    return new ElementLayoutConf()
      .set("x", node.getAttributeOf("x"))
      .set("y", node.getAttributeOf("y"))
      .set("w", node.getAttributeOf("w"))
      .set("h", node.getAttributeOf("h"))
      .set("align", node.getAttributeOf("align", ALIGN_VALUES.LEFT))
      .set("alignV", node.getAttributeOf("alignV", ALIGN_V_VALUES.TOP))
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
  private imageElement(node: XMLNodeElement): TypeSourceImageElement {
    const srcVal = node.getAttributeOf("src");
    const valueDefine = this.getSourceDefineByName(srcVal);
    const sourceImageData = new DefineSourceData();
    const sourceImageElement = new SourceImageElement();
    sourceImageData.set("src", path.normalize(srcVal)); // 默认使用 srcVal
    if (valueDefine && valueDefine.sourceData) {
      const { sourceData, description } = valueDefine;
      const { src } = sourceData;
      const imageData = getImageData(this.resolveRootSourcePath(src));
      sourceImageData.set("width", imageData.width);
      sourceImageData.set("height", imageData.height);
      sourceImageData.set("filename", imageData.filename);
      sourceImageData.set("ninePatch", imageData.ninePatch);
      sourceImageData.set("size", imageData.size);
      sourceImageData.set("src", src);
      sourceImageElement.set("name", description);
      sourceImageElement.set("sourceData", sourceImageData.create());
      sourceImageElement.set("layout", this.layoutConf(node));
    }
    return sourceImageElement.create();
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
   *   "tagName": "Image",
   *   "name": "com.android.contacts.activities.TwelveKeyDialer",
   *   "description": "拨号",
   *   "valueData": {
   *       "defaultValue": "file://icons/res/com.android.contacts.activities.TwelveKeyDialer.png",
   *       "valueName": "",
   *       "src": "icons/res/com.android.contacts.activities.TwelveKeyDialer.png"
   *   }
   * }
   * ```
   * @param node
   * @returns
   */
  private textElement(node: XMLNodeElement): TypeSourceTextElement {
    const layout = this.layoutConf(node);
    const text = node.getAttributeOf("text");
    const colorVal = node.getAttributeOf("color");
    const valueDefine = this.getSourceDefineByName(colorVal);
    const textElementData = new SourceTextElement();
    textElementData.set("text", text);
    textElementData.set("name", text);
    textElementData.set("layout", {
      x: layout.x,
      y: layout.y,
      align: layout.align,
      alignV: layout.alignV
    });
    if (valueDefine) {
      const { description, valueData } = valueDefine;
      textElementData.set("name", description);
      textElementData.set("valueData", valueData);
    }
    return textElementData.create();
  }

  /**
   * 获取布局元素对应的解析数据列表
   * @returns
   */
  getLayoutElementList(): TypeSourceLayoutElement[] {
    return this.getRootNode()
      .getFirstChildNodeByTagname(ELEMENT_TAG.LAYOUT)
      .getChildrenNodes()
      .flatMap(node => {
        switch (node.getTagname()) {
          case ELEMENT_TAG.IMAGE: {
            return this.imageElement(node);
          }
          case ELEMENT_TAG.TEXT: {
            return this.textElement(node);
          }
          default: {
            return [];
          }
        }
      });
  }

  getData(): TypeSourcePageData {
    return new SourcePageData()
      .set("config", this.pageConfig)
      .set("version", this.getVersion())
      .set("description", this.getDescription())
      .set("screenWidth", this.getScreenWidth())
      .set("previewList", this.getPreviewList())
      .set("sourceDefineList", this.sourceDefineInstance.getSourceDefineList())
      .set("layoutElementList", this.getLayoutElementList())
      .set("copyList", this.getCopyConfList())
      .create();
  }
}
