import path from "path";
import querystring from "querystring";
import PATHS from "server/utils/pathUtils";
import { getImageData } from "common/utils";
import {
  ELEMENT_TYPES,
  ALIGN_VALUES,
  ALIGN_V_VALUES,
  VALUE_TYPES
} from "src/enum/index";
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
import { ElementLayoutConf, SourcePageData } from "data/SourceConfig";
// import TempKeyValMapper from "./TempKeyValMapper";
import BaseCompiler from "./BaseCompiler";
import XmlTemplate from "./XmlTemplate";

type TypeCache = {
  xmlTempConfList: TypeSourceXmlTempConf[] | null;
  xmlTempReplacedMap: Map<string, XMLNodeElement> | null;
  xmlTemplateList: TypeSourceXmlTempData[] | null;
  xmlTempKeyValMap: TypeXmlTempKeyValMap | null;
};
export default class PageConfig extends BaseCompiler {
  // 被多次使用的数据添加缓存
  private cache: TypeCache = {
    xmlTempConfList: null,
    xmlTempReplacedMap: null,
    xmlTemplateList: null,
    xmlTempKeyValMap: null
  };
  // 处理当前页面资源的相对路径
  private relativePath(pathname: string): string {
    const namespace = path.relative(
      PATHS.SOURCE_CONFIG_DIR,
      path.dirname(this.getFile())
    );
    return path.join(namespace, pathname);
  }

  // 处理当前页面资源的绝对路径
  private resolvePath(pathname: string): string {
    return path.join(path.dirname(this.getFile()), pathname);
  }

  /**
   * 处理当前页面中定义以配置路径为根路径的路径
   * ```xml
   * <!-- 定义一下 src 的文件路径在 wallpaper/ 下 ->
   * <tag src="wallpaper/value.xml"/>
   * ```
   */
  private relativeSourceRootPath(pathname: string): string {
    const relative = path.relative(pathname, path.dirname(pathname));
    return this.relativePath(path.join(relative, pathname));
  }

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
   * <previews>
   *     <preview src="../preview/preview.jpg"/>
   * </previews>
   * ```
   * @returns
   */
  getPreviewList(): string[] {
    return super
      .getRootFirstChildNodeOf("previews")
      .getChildrenNodesByTagname("preview")
      .map(item => this.relativePath(item.getAttributeOf("src")));
  }

  /**
   * template 配置原始数据
   * @returns
   */
  getXmlTempConfList(): TypeSourceXmlTempConf[] {
    if (!this.cache.xmlTempConfList) {
      this.cache.xmlTempConfList = super
        .getRootChildrenNodesOf("template")
        .map<TypeSourceXmlTempConf>(item => ({
          template: item.getAttributeOf("src"),
          values: item.getAttributeOf("values"),
          release: item.getAttributeOf("release") || item.getAttributeOf("to")
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
        .getRootFirstChildNodeOf("templates")
        .getChildrenNodesByTagname("template")
        .reduce<[string, XMLNodeElement][]>((t, o) => {
          const src = o.getAttributeOf("src");
          const values = o.getAttributeOf("values");
          if (!src || !values) return t;
          const valuesSrc = this.resolvePath(values);
          const replacedTempNode = new XmlTemplate(
            this.resolvePath(src)
          ).replacePlaceholderByValFile(valuesSrc);
          t.push([this.relativePath(src), replacedTempNode]);
          return t;
        }, []);
      this.cache.xmlTempReplacedMap = new Map(tempReplacedIterator);
    }
    return this.cache.xmlTempReplacedMap;
  }

  // /**
  //  * 获取已经替换过占位符的模板 XMLNode 实例
  //  * @param pathname
  //  */
  // getTempReplacedNode(pathname: string): XMLNodeElement {
  //   // if (!this.cache.xmlTempReplacedMap?.has(pathname)) {
  //   //   const replacedTempNode = new XmlTemplate(this.resolvePath(pathname)).replacePlaceholderByValFile()
  //   // }
  //   return (
  //     this.cache.xmlTempReplacedMap?.get(pathname) ||
  //     XMLNodeElement.createEmptyNode()
  //   );
  // }

  /**
   * 获取模板被替换占位符后的节点数据实例
   * @returns
   */
  // getXmlTempKeyValMap(): TypeXmlTempKeyValMap {
  //   if (!this.cache.xmlTempKeyValMap) {
  //     const kvObj = this.getXmlTempConfList().reduce<TypeXmlTempKeyValMap>(
  //       (obj, item) => {
  //         const kvList = new TempKeyValMapper(
  //           this.resolvePath(item.values)
  //         ).getKeyValList();
  //         return new Map([
  //           ...obj,
  //           ...new XmlTemplate(
  //             this.resolvePath(item.template)
  //           ).getNameValueMapObj(kvList, item.template)
  //         ]);
  //       },
  //       new Map()
  //     );
  //     this.cache.xmlTempKeyValMap = new Map(Object.entries(kvObj));
  //   }
  //   return this.cache.xmlTempKeyValMap;
  // }

  /**
   * xml 模板列表，用于前端展示
   * @returns
   */
  getXmlTempListForUI(): TypeSourceXmlTempData[] {
    if (!this.cache.xmlTemplateList) {
      this.cache.xmlTemplateList = super
        .getRootFirstChildNodeOf("templates")
        .getChildrenNodesByTagname("template")
        .map<TypeSourceXmlTempData>(node => {
          // const values = node.getAttributeOf("values");
          const src = node.getAttributeOf("src");
          const release =
            node.getAttributeOf("to") || node.getAttributeOf("release");
          const prefix = `template 缺少`;
          const suffix = `(${super.getFileName()})`;
          if (!src) throw new Error(`${prefix} src 属性 ${suffix}`);
          if (!release) throw new Error(`${prefix} to/release 属性 ${suffix}`);

          // const valueList = values
          //   ? new TempKeyValMapper(this.resolvePath(values)).getDataList()
          //   : [];
          const template = this.relativePath(src);
          return { template, release, valueList: [] };
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
        from: this.relativePath(node.getAttributeOf("from")),
        release: node.getAttributeOf("to") || node.getAttributeOf("release")
      }));
  }

  /**
   * 解析图片节点
   * ```xml
   * <image
   *  name="天气图标"
   *  x="0" y="0" w="100" h="100" align="center" alignV="center"
   *  src="../icons/weather.png"
   * >
   * <!-- to/release 可以写多行复制多个文件，有两种写法 -->
   *  <to>icon/res/weather1.png</to>
   *  <release>icon/res/weather2.png</release>
   *  <to src="icon/res/weather3/>
   *  <release src="icon/res/weather3/>
   * </image>
   * ```
   * @param node
   * @returns
   */
  private imageElement(node: XMLNodeElement): TypeSourceImageElement {
    const src = node.getAttributeOf("src");
    const source = {
      ...getImageData(this.resolvePath(src)),
      url: this.relativePath(src)
    };
    const releaseList = node
      .getChildrenNodeByMultiTagname(["to", "release"])
      .map(item => item.getFirstTextChildValue() || item.getAttributeOf("src"));
    return {
      elementType: ELEMENT_TYPES.IMAGE,
      valueType: VALUE_TYPES.SOURCE,
      name: node.getAttributeOf("name"),
      source,
      layout: this.layoutConf(node),
      releaseList
    };
  }

  /**
   * 从值的 query 字符串中获得对应的映射值
   * 以下表示获取“工程目录下 wallpaper/theme_values.xml 中 name=action_bar_title_text_color_light 的 text 值”
   * ```xml
   * <to>file=${project}/wallpaper/theme_values.xml&amp;name=action_bar_title_text_color_light</to>
   * ```
   * @param query file=${project}/wallpaper/theme_values.xml&amp;name=action_bar_title_text_color_light
   * @returns
   */
  private getValueByQueryStr(query: string): {
    name: string;
    file: string;
  } {
    let { file, name } = querystring.parse(query);
    if (!file || !name) {
      console.debug("query错误", query);
      return { name: "", file: "" };
    }
    // 如果有多个参数取第一个
    if (Array.isArray(file)) file = file[0];
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
    return { name, file };
  }
  /**
   * 解析文字节点
   * ```xml
   * <!-- color 引用 template 定义的 src 中的值 -->
   * <text
   *  name="图标字体"
   *  text="拨号"
   *  x="415" y="1250" size="36" align="center" alignV="center"
   *  color="${action_bar_title_text_color_light}"
   * />
   * ```
   * @param node
   * @returns
   */
  private valueElement(node: XMLNodeElement): TypeSourceValueElement {
    const valueType = node.getTagname<VALUE_TYPES>();
    const layout = this.layoutConf(node);
    const text = node.getAttributeOf("text");
    // 若没有 name 则使用 text
    const name = node.getAttributeOf("name", text);
    const defaultVal = node.getAttributeOf("default");
    const releaseVal = (
      node.getFirstChildNodeByTagname("to") ||
      node.getFirstChildNodeByTagname("release")
    ).getFirstTextChildValue();
    // # 开头为颜色
    const defaultIsColor = defaultVal.startsWith("#");
    const defaultData = this.getValueByQueryStr(defaultVal);
    const releaseData = this.getValueByQueryStr(releaseVal);
    if (releaseVal.startsWith("#")) {
    }

    const defaultValue = new XmlTemplate(
      this.resolvePath(defaultData.file)
    ).getTextByAttrName(defaultData.name);

    return {
      elementType: ELEMENT_TYPES.TEXT,
      valueType,
      name,
      text,
      defaultValue: defaultIsColor ? defaultVal : defaultValue,
      defaultName: defaultData.name,
      defaultXml: this.relativePath(defaultData.file),
      releaseName: releaseData.name,
      releaseXml: releaseData.file,
      layout: {
        x: layout.x,
        y: layout.y,
        align: layout.align,
        alignV: layout.alignV
      }
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
   * 获取布局元素对应的解析数据列表
   * @returns
   */
  getLayoutElementList(): TypeSourceElement[] {
    // 生成 template Map 数据
    this.getXmlTempDataMap();
    const rootNode = this.getRootNode();
    const elementList = rootNode
      .getFirstChildNodeByTagname("layout")
      .getChildrenNodes();
    const result: TypeSourceElement[] = [];
    elementList.forEach(node => {
      switch (node.getTagname()) {
        case ELEMENT_TYPES.IMAGE: {
          result.push(this.imageElement(node));
          break;
        }
        case VALUE_TYPES.COLOR: {
          result.push(this.valueElement(node));
          break;
        }
      }
    });
    return result;
  }

  getData(): TypeSourcePageData {
    return new SourcePageData()
      .set("url", this.relativePath(path.basename(this.getFile())))
      .set("version", this.getVersion())
      .set("description", this.getDescription())
      .set("screenWidth", this.getScreenWidth())
      .set("previewList", this.getPreviewList())
      .set("elementList", this.getLayoutElementList())
      .set("templateList", this.getXmlTempListForUI())
      .set("copyList", this.getCopyConfList())
      .create();
  }
}
