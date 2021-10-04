import path from "path";
import { URL, URLSearchParams } from "url";
import fse from "fs-extra";
import { XmlValueData, ResDefinition } from "src/data/ResourceConfig";
import { getImageData } from "src/utils/index";
import { TypeResDefinition } from "src/types/resource";
import { RESOURCE_PROTOCOL } from "src/enum";
import XMLNodeElement from "server/compiler/XMLNodeElement";
import ImageData from "src/data/ImageData";
import XmlTemplate from "./XmlTemplate";
import XmlFileCompiler from "./XmlFileCompiler";

/**
 * 解析素材定义数据
 * ```xml
 * <Resource
 *      name="wallpaper"
 *      description="默认壁纸"
 *      value="image://wallpaper/default_wallpaper.jpg"
 * />
 * ```
 */
export default class ResourceDefinitionCompiler {
  private resourceNodes: XMLNodeElement[];
  private resourceRoot: string;
  private resourceMap = new Map<string, TypeResDefinition>();
  constructor(resNodes: XMLNodeElement[], resourceRoot: string) {
    this.resourceNodes = resNodes;
    this.resourceRoot = resourceRoot;
  }

  // 获取 url 解析数据
  getUrlData(url: string): {
    protocol: RESOURCE_PROTOCOL | string;
    src: string;
    searchParams: URLSearchParams;
  } {
    const urlData = new URL(url);
    return {
      protocol: urlData.protocol.replace(/:$/, ""),
      src: path.join(urlData.hostname, urlData.pathname),
      searchParams: urlData.searchParams
    };
  }

  // 生成当前配置中相对路径路径的绝对路径
  private resolvePath(pathname: string): string {
    return path.join(this.resourceRoot, pathname);
  }

  /**
   * 值节点定义数据
   * ```xml
   * <Resource
   *     name="icon_title_text"
   *     description="颜色值测试"
   *     value="xml://com.miui.home/theme_values.xml"
   * />
   * ```
   * ->
   * ```json
   * {
   *   "name": "icon_title_text",
   *   "description": "颜色值测试",
   *   "data": {} as xml2js.Element
   * }
   * ```
   * @param node
   * @returns
   */
  private getResDefinition(node: XMLNodeElement): TypeResDefinition {
    const value = node.getAttributeOf("value");
    const description = node.getAttributeOf("description");
    const { protocol, src, searchParams } = this.getUrlData(value);
    const resDefinition = new ResDefinition()
      .set("type", node.getAttributeOf("type"))
      .set("name", node.getAttributeOf("name"))
      .set("desc", description);
    // 图片素材
    if (protocol === RESOURCE_PROTOCOL.IMAGE) {
      const resImageData = new ImageData();
      const file = this.resolvePath(src);
      if (fse.existsSync(file)) {
        resImageData.setBatch(getImageData(file));
      }
      resDefinition.set("protocol", protocol);
      resDefinition.set("data", resImageData.create());
      resDefinition.set("src", src);
    }
    // xml 素材
    if (protocol === RESOURCE_PROTOCOL.XML) {
      // url 中的 name 参数
      // TODO： 先固定使用 name，后续看需求是否需要自定义其他属性去 xml 中查找
      const valueName = searchParams.get("name") || "";
      const defaultValue = new XmlTemplate(
        XmlFileCompiler.from(this.resolvePath(src)).getElement()
      ).getTextByAttrName(valueName);
      const xmlValueData = new XmlValueData()
        .set("valueName", valueName)
        .set("defaultValue", defaultValue)
        .create();
      resDefinition.set("protocol", protocol);
      resDefinition.set("data", xmlValueData);
      resDefinition.set("src", src);
    }
    return resDefinition.create();
  }

  getResDefinitionMap(): Map<string, TypeResDefinition> {
    if (this.resourceMap.size === 0) {
      this.resourceNodes.forEach(item => {
        const name = item.getAttributeOf("name");
        const value = item.getAttributeOf("value");
        if (name && value) {
          const resourceData = this.getResDefinition(item);
          this.resourceMap.set(name, resourceData);
        }
      });
    }
    return this.resourceMap;
  }

  getResDefinitionList(): TypeResDefinition[] {
    const result: TypeResDefinition[] = [];
    this.getResDefinitionMap().forEach(item => result.push(item));
    return result;
  }

  getResDefinitionByName(name: string): TypeResDefinition | null {
    return this.getResDefinitionMap().get(name) || null;
  }
}
