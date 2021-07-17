import path from "path";
import querystring from "querystring";
import { getImageData } from "common/utils";
import { ELEMENT_TAG, ALIGN_VALUES, ALIGN_V_VALUES } from "enum/index";
import {
  TypeSourceXmlTempData,
  TypeSourceCopyConf,
  TypeSourceElement,
  TypeSourcePageData,
  TypeSourceImageElement,
  TypeSourceValueElement,
  TypeSourceXmlTempConf,
  TypeXmlTempKeyValMap
} from "types/source-config";
import XMLNodeElement from "server/compiler/XMLNodeElement";
import {
  ElementLayoutConf,
  SourceImageElement,
  SourcePageData,
  SourceValueElement
} from "data/SourceConfig";
// import TempKeyValMapper from "./TempKeyValMapper";
import PATH from "server/utils/pathUtils";
import PathResolver from "src/core/PathResolver";
import BaseCompiler from "./BaseCompiler";
import XmlTemplate from "./XmlTemplate";

type TypeCache = {
  xmlTempConfList: TypeSourceXmlTempConf[] | null;
  xmlTempReplacedMap: Map<string, XMLNodeElement> | null;
  xmlTemplateList: TypeSourceXmlTempData[] | null;
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
    xmlTempConfList: null,
    xmlTempReplacedMap: null,
    xmlTemplateList: null,
    xmlTempKeyValMap: null
  };

  // ${root}/path/to/somewhere -> absolute/source/root/to/somewhere
  private resolveRootSourcePath(pathname: string): string {
    return PathResolver.parse({ root: this.sourceRootAbsolute }, pathname);
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
   * xml 模板列表，用于前端展示
   * @returns
   */
  getXmlTempListForUI(): TypeSourceXmlTempData[] {
    if (!this.cache.xmlTemplateList) {
      this.cache.xmlTemplateList = super
        .getRootFirstChildNodeOf(ELEMENT_TAG.TEMPLATES)
        .getChildrenNodesByTagname(ELEMENT_TAG.TEMPLATE)
        .map<TypeSourceXmlTempData>(node => {
          // const values = node.getAttributeOf("values");
          const src = node.getAttributeOf("src");
          const release = node.getAttributeOf("value");
          const prefix = `template 缺少`;
          const suffix = `(${super.getFileName()})`;
          if (!src) throw new Error(`${prefix} src 属性 ${suffix}`);
          if (!release) throw new Error(`${prefix} to/release 属性 ${suffix}`);

          // const valueList = values
          //   ? new TempKeyValMapper(this.resolvePath(values)).getDataList()
          //   : [];
          return { template: src, release, valueList: [] };
        });
    }
    return this.cache.xmlTemplateList;
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
   * 解析图片节点
   * ```xml
   * <image
   *  name="天气图标"
   *  x="0" y="0" w="100" h="100" align="center" alignV="center"
   *  src="${root}/icons/weather.png"
   * >
   * @param node
   * @returns
   */
  private imageElement(node: XMLNodeElement): TypeSourceImageElement {
    const src = node.getAttributeOf("src");
    const source: TypeSourceImageElement["source"] = {
      ...getImageData(this.resolveRootSourcePath(src)),
      src: path.normalize(src),
      release: path.normalize(src)
    };
    return new SourceImageElement()
      .set("name", node.getAttributeOf("name"))
      .set("source", source)
      .set("layout", this.layoutConf(node))
      .create();
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
    // // 以 ${project} 开头的表示该路径为相对于项目的路径
    // const isProjectPath = /^\$\{project\}\/.+/.test(query);
    // if (isProject) return { name, value: "", file: file };

    // const tempFile = this.relativePath(file);
    // let tempData: XMLNodeElement | undefined =
    //   this.getXmlTempDataMap().get(tempFile);
    // if (!tempData) {
    //   tempData = new XmlTemplate(this.resolvePath(file));
    //   this.getXmlTempDataMap().set(tempFile, tempData);
    // }
    // const value = tempData
    //   .getFirstChildNode()
    //   .getFirstChildNodeByAttrValue("name", name)
    //   .getFirstTextChildValue();
    return { name, src };
  }
  /**
   * 解析文字节点
   * ```xml
   * <Text
   *  name="图标字体"
   *  text="拨号"
   *  x="415" y="1250" size="36" align="center" alignV="center"
   *  value=src=${root}/wallpaper/theme_values.xml&amp;name=action_bar_title_text_color_light
   * />
   * ```
   * @param node
   * @returns
   */
  private valueElement(node: XMLNodeElement): TypeSourceValueElement {
    const layout = this.layoutConf(node);
    const text = node.getAttributeOf(ELEMENT_TAG.TEXT);
    // 若没有 name 则使用 text
    const name = node.getAttributeOf("name", text);
    const value = node.getAttributeOf("value");
    // # 开头为颜色
    const valueIsColor = value.startsWith("#");
    const valueData = this.getValueByQueryStr(value);

    const defaultValue = new XmlTemplate(
      this.resolveRootSourcePath(valueData.src)
    ).getTextByAttrName(valueData.name);
    return new SourceValueElement()
      .set("name", name)
      .set("text", text)
      .set("value", {
        valueName: valueData.name,
        src: valueData.src,
        defaultValue: valueIsColor ? value : defaultValue
      })
      .set("layout", {
        x: layout.x,
        y: layout.y,
        align: layout.align,
        alignV: layout.alignV
      })
      .create();
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
   * 获取布局元素对应的解析数据列表
   * @returns
   */
  getLayoutElementList(): TypeSourceElement[] {
    // 生成 template Map 数据
    this.getXmlTempDataMap();
    const rootNode = this.getRootNode();
    const elementList = rootNode
      .getFirstChildNodeByTagname(ELEMENT_TAG.LAYOUT)
      .getChildrenNodes();
    return elementList.flatMap(node => {
      switch (node.getTagname()) {
        case ELEMENT_TAG.IMAGE: {
          return this.imageElement(node);
        }
        case ELEMENT_TAG.TEXT: {
          return this.valueElement(node);
        }
      }
      return [];
    });
  }

  getData(): TypeSourcePageData {
    return (
      new SourcePageData()
        .set("config", this.pageConfig)
        .set("version", this.getVersion())
        .set("description", this.getDescription())
        .set("screenWidth", this.getScreenWidth())
        .set("previewList", this.getPreviewList())
        .set("elementList", this.getLayoutElementList())
        // .set("templateList", this.getXmlTempListForUI())
        .set("copyList", this.getCopyConfList())
        .create()
    );
  }
}
