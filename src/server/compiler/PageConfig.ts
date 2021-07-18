import path from "path";
import querystring from "querystring";
import { URL } from "url";
import { getImageData } from "common/utils";
import { ELEMENT_TAG, ALIGN_VALUES, ALIGN_V_VALUES } from "enum/index";
import {
  TypeSourceCopyConf,
  TypeSourceLayoutElement,
  TypeSourcePageData,
  TypeSourceImageElement,
  TypeSourceTextElement,
  TypeSourceXmlTempConf,
  TypeXmlTempKeyValMap,
  TypeSourceDefine
} from "types/source-config";
import XMLNodeElement from "server/compiler/XMLNodeElement";
import {
  ElementLayoutConf,
  SourceImageData,
  SourceImageElement,
  SourcePageData,
  SourceTextElement,
  SourceValueDefine
} from "data/SourceConfig";
import { placeholderRegexp } from "src/common/regexp";
import PATH from "server/utils/pathUtils";
import BaseCompiler from "./BaseCompiler";
import XmlTemplate from "./XmlTemplate";

type TypeCache = {
  xmlValueDefineList: TypeSourceDefine[];
  xmlValueDefineMap: Map<string, TypeSourceDefine>;
  xmlTempConfList: TypeSourceXmlTempConf[] | null;
  xmlTempReplacedMap: Map<string, XMLNodeElement> | null;
  xmlTempKeyValMap: TypeXmlTempKeyValMap | null;
};
export default class PageConfig extends BaseCompiler {
  private sourceNamespace: string;
  private pageNamespace: string;
  private pageConfig: string;
  private sourceRootAbsolute: string;
  constructor(data: { namespace: string; config: string }) {
    super(path.join(PATH.SOURCE_CONFIG_DIR, data.namespace, data.config));
    this.sourceNamespace = path.normalize(data.namespace);
    this.pageNamespace = path.dirname(data.config);
    this.pageConfig = path.normalize(data.config);
    this.sourceRootAbsolute = path.join(PATH.SOURCE_CONFIG_DIR, data.namespace);
  }

  // 被多次使用的数据添加缓存
  private cache: TypeCache = {
    xmlValueDefineList: [],
    xmlValueDefineMap: new Map(),
    xmlTempConfList: null,
    xmlTempReplacedMap: null,
    xmlTempKeyValMap: null
  };

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
   * template 配置原始数据
   * @returns
   */
  getXmlTempConfList(): TypeSourceXmlTempConf[] {
    if (!this.cache.xmlTempConfList) {
      this.cache.xmlTempConfList = super
        .getRootChildrenNodesOf(ELEMENT_TAG.TEMPLATE)
        .map<TypeSourceXmlTempConf>(item => ({
          template: item.getAttributeOf("src"),
          values: item.getAttributeOf("values"),
          release: item.getAttributeOf("value")
        }));
    }
    return this.cache.xmlTempConfList;
  }

  /**
   * 处理所有模板生成替换占位符后的 XMLNode 实例
   * @returns
   */
  getXmlTempDataMap(): Map<string, XMLNodeElement> {
    if (!this.cache.xmlTempReplacedMap) {
      const tempReplacedIterator = super
        .getRootFirstChildNodeOf(ELEMENT_TAG.TEMPLATES)
        .getChildrenNodesByTagname(ELEMENT_TAG.TEMPLATE)
        .reduce<[string, XMLNodeElement][]>((t, o) => {
          const src = o.getAttributeOf("src");
          const values = o.getAttributeOf("values");
          if (!src || !values) return t;
          const valuesSrc = this.relativeSourcePath(values);
          const replacedTempNode = new XmlTemplate(
            this.relativeSourcePath(src)
          ).replacePlaceholderByValFile(valuesSrc);
          t.push([src, replacedTempNode]);
          return t;
        }, []);
      this.cache.xmlTempReplacedMap = new Map(tempReplacedIterator);
    }
    return this.cache.xmlTempReplacedMap;
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

  // 获取 url 解析数据
  private getUrlData(url: string) {
    const data = new URL(url);
    return {
      src: path.join(data.hostname, data.pathname),
      searchParams: data.searchParams
    };
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
    const valueDefine = this.getValueDefine(srcVal);
    const sourceData = new SourceImageData();
    const sourceImageElement = new SourceImageElement();
    sourceData.set("src", path.normalize(srcVal)); // 默认使用 srcVal
    if (valueDefine) {
      const imageData = getImageData(
        this.resolveRootSourcePath(valueDefine.valueData.src)
      );
      sourceData.set("width", imageData.width);
      sourceData.set("height", imageData.height);
      sourceData.set("filename", imageData.filename);
      sourceData.set("ninePatch", imageData.ninePatch);
      sourceData.set("size", imageData.size);
      sourceData.set("src", path.normalize(valueDefine.valueData.src));
      sourceImageElement.set("name", valueDefine.description);
      sourceImageElement.set("sourceData", sourceData.create());
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
    const valueDefine = this.getValueDefine(colorVal);
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
      textElementData.set("name", valueDefine.description);
      textElementData.set("valueData", valueDefine.valueData);
    }
    return textElementData.create();
  }

  /**
   * 值节点定义数据
   * ```xml
   * <Color
   *     name="icon_title_text"
   *     description="颜色值测试"
   *     value="file://com.miui.home/theme_values.xml?name=icon_title_text"
   * />
   * ```
   * ->
   * ```json
   * {
   *   "tagName": "Color",
   *   "name": "icon_title_text",
   *   "description": "颜色值测试",
   *   "value": {
   *      "defaultValue": "#ffff0000",
   *      "valueName": "icon_title_text",
   *      "src": "com.miui.home/theme_values.xml"
   *   }
   * }
   * ```
   * @param node
   * @returns
   */
  private valueDefineData(node: XMLNodeElement): TypeSourceDefine {
    const value = node.getAttributeOf("value");
    let defaultValue = value;
    let valueName = "";
    let src = "";
    if (value) {
      const valData = this.getUrlData(value);
      if (valData) {
        src = valData.src;
        // url 中的 name 参数
        // TODO： 先固定使用 name，后续看需求是否需要自定义其他属性去 xml 中查找
        valueName = valData.searchParams.get("name") || "";
        defaultValue =
          path.extname(src) === ".xml"
            ? new XmlTemplate(
                this.resolveRootSourcePath(src)
              ).getTextByAttrName(valueName)
            : src;
      }
    }
    return new SourceValueDefine()
      .set("tagName", node.getTagname())
      .set("name", node.getAttributeOf("name"))
      .set("description", node.getAttributeOf("description"))
      .set("valueData", { defaultValue, valueName, src })
      .create();
  }

  /**
   * 获取定义的配置节点列表
   * @returns
   */
  getSourceDefineList(): TypeSourceDefine[] {
    if (this.cache.xmlValueDefineList.length === 0) {
      this.cache.xmlValueDefineList = this.getRootNode()
        .getFirstChildNodeByTagname(ELEMENT_TAG.VALUE)
        .getChildrenNodes()
        .map(item => {
          const data = this.valueDefineData(item);
          this.cache.xmlValueDefineMap.set(data.name, data);
          return data;
        });
    }
    return this.cache.xmlValueDefineList;
  }

  /**
   * 获取定义的配置列表 map
   * @returns
   */
  private getValueDefineMap(): Map<string, TypeSourceDefine> {
    if (this.cache.xmlValueDefineMap.size === 0) {
      this.getSourceDefineList();
    }
    return this.cache.xmlValueDefineMap;
  }

  /**
   * 通过 name 获取定义 value 的数据节点
   * @params str 形如字符串 ${name}
   * @returns
   */
  getValueDefine(str: string): TypeSourceDefine | null {
    const execResult = placeholderRegexp.exec(str);
    // 未匹配到返回值
    if (!execResult?.[1]) return null;
    const name = execResult[1];
    return this.getValueDefineMap().get(name) || null;
  }

  /**
   * 获取布局元素对应的解析数据列表
   * @returns
   */
  getLayoutElementList(): TypeSourceLayoutElement[] {
    // 生成 template Map 数据
    // this.getXmlTempDataMap();
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
      .set("sourceDefineList", this.getSourceDefineList())
      .set("layoutElementList", this.getLayoutElementList())
      .set("copyList", this.getCopyConfList())
      .create();
  }
}
