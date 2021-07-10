import path from "path";
import PATHS from "server/utils/pathUtils";
import { getImageData, getPlaceholderVal } from "common/utils";
import { ELEMENT_TYPES, ALIGN_VALUES, ALIGN_V_VALUES } from "src/enum/index";
import {
  TypeSourceXmlTempData,
  TypeSourceCopyConf,
  TypeSourceElement,
  TypeSourcePageData,
  TypeSourceImageElement,
  TypeSourceTextElement,
  TypeSourceXmlTempConf
} from "types/source-config";
import XMLNodeBase from "server/compiler/XMLNodeElement";
import TempKeyValMapper from "./TempKeyValMapper";
import BaseCompiler from "./BaseCompiler";
import XmlTemplate from "./XmlTemplate";

type TypeCache = {
  xmlTempConfList: TypeSourceXmlTempConf[] | null;
  xmlTemplateList: TypeSourceXmlTempData[] | null;
  xmlTempKeyValMap: Map<string, string> | null;
};
export default class PageConfig extends BaseCompiler {
  // 被多次使用的数据添加缓存
  private cache: TypeCache = {
    xmlTempConfList: null,
    xmlTemplateList: null,
    xmlTempKeyValMap: null
  };
  // 处理当前页面资源的相对路径
  private relativePath(file: string): string {
    const namespace = path.relative(
      PATHS.SOURCE_CONFIG_DIR,
      path.dirname(this.getFile())
    );
    return path.join(namespace, file);
  }

  // 处理当前页面资源的绝对路径
  private resolvePath(file: string): string {
    return path.join(path.dirname(this.getFile()), file);
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

  getPreviewList(): string[] {
    return super
      .getRootChildrenNodesOf("preview")
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
          value: item.getAttributeOf("value"),
          release: item.getAttributeOf("release") || item.getAttributeOf("to")
        }));
    }
    return this.cache.xmlTempConfList;
  }

  /**
   * 获取模板被替换占位符后的节点数据实例
   * @returns
   */
  getXmlTempKeyValMap(): Map<string, string> {
    if (!this.cache.xmlTempKeyValMap) {
      const kvObj = this.getXmlTempConfList().reduce<Record<string, string>>(
        (obj, item) => {
          const kvList = new TempKeyValMapper(
            this.resolvePath(item.value)
          ).getKeyValList();
          return {
            ...obj,
            ...new XmlTemplate(
              this.resolvePath(item.template)
            ).getNameValueMapObj(kvList)
          };
        },
        {}
      );
      this.cache.xmlTempKeyValMap = new Map(Object.entries(kvObj));
    }
    return this.cache.xmlTempKeyValMap;
  }

  /**
   * xml 模板列表，用于前端展示
   * @returns
   */
  getXmlTempListForUI(): TypeSourceXmlTempData[] {
    if (!this.cache.xmlTemplateList) {
      this.cache.xmlTemplateList = super
        .getRootChildrenNodesOf("template")
        .map<TypeSourceXmlTempData>(node => {
          const value = node.getAttributeOf("value");
          const src = node.getAttributeOf("src");
          const release =
            node.getAttributeOf("to") || node.getAttributeOf("release");
          const prefix = `template 缺少`;
          const suffix = `(${super.getFileName()})`;
          if (!value) throw new Error(`${prefix} value 属性 ${suffix}`);
          if (!src) throw new Error(`${prefix} src 属性 ${suffix}`);
          if (!release) throw new Error(`${prefix} to/release 属性 ${suffix}`);

          const valueList = new TempKeyValMapper(
            this.resolvePath(value)
          ).getDataList();
          const template = this.relativePath(src);
          return { template, release, valueList };
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
  private imageElement(node: XMLNodeBase): TypeSourceImageElement {
    const src = node.getAttributeOf("src");
    const source = {
      ...getImageData(this.resolvePath(src)),
      url: this.relativePath(src)
    };
    const releaseList = node
      .getChildrenNodeByMultiTagname(["to", "release"])
      .map(item => item.getFirstTextChildValue() || item.getAttributeOf("src"));
    return {
      type: ELEMENT_TYPES.IMAGE,
      name: node.getAttributeOf("name"),
      source,
      layout: this.layoutConf(node),
      releaseList
    };
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
  private textElement(node: XMLNodeBase): TypeSourceTextElement {
    const layout = this.layoutConf(node);
    const text = node.getAttributeOf("text");
    // 若没有 name 则使用 text
    const name = node.getAttributeOf("name", text);
    const colorVal = node.getAttributeOf("color");
    const colorName = getPlaceholderVal(colorVal) || colorVal;
    const defaultColor = this.getXmlTempKeyValMap().get(colorName) || "";
    return {
      type: ELEMENT_TYPES.TEXT,
      name,
      text,
      layout: {
        x: layout.x,
        y: layout.y,
        align: layout.align,
        alignV: layout.alignV
      },
      defaultColor,
      colorName
    };
  }

  /**
   * 节点布局信息
   * @param node
   * @returns
   */
  private layoutConf(node: XMLNodeBase) {
    return {
      x: node.getAttributeOf("x"),
      y: node.getAttributeOf("y"),
      w: node.getAttributeOf("w"),
      h: node.getAttributeOf("h"),
      align: node.getAttributeOf("align", ALIGN_VALUES.LEFT),
      alignV: node.getAttributeOf("alignV", ALIGN_V_VALUES.TOP)
    };
  }

  /**
   * 获取布局元素对应的解析数据列表
   * @returns
   */
  getLayoutElementList(): TypeSourceElement[] {
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
        case ELEMENT_TYPES.TEXT: {
          result.push(this.textElement(node));
          break;
        }
      }
    });
    return result;
  }

  getData(): TypeSourcePageData {
    return {
      url: this.relativePath(path.basename(this.getFile())),
      version: this.getVersion(),
      description: this.getDescription(),
      screenWidth: this.getScreenWidth(),
      previewList: this.getPreviewList(),
      elementList: this.getLayoutElementList(),
      templateList: this.getXmlTempListForUI(),
      copyList: this.getCopyConfList()
    };
  }
}
