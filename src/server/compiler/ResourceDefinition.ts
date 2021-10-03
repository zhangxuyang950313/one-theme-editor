import path from "path";
import { URL, URLSearchParams } from "url";
import fse from "fs-extra";
import {
  ResImageData,
  ResValueData,
  ResDefinition
} from "src/data/ResourceConfig";
import { getImageData } from "src/utils/index";
import { TypeResDefinition } from "src/types/resource";
import { FILE_PROTOCOL } from "src/enum";
import XMLNodeElement from "server/compiler/XMLNodeElement";
import XmlTemplate from "./XmlTemplate";
import XmlFileCompiler from "./XmlFileCompiler";

/**
 * 解析素材定义数据
 */
export default class ResourceDefinitionCompiler {
  private node: XMLNodeElement;
  private resourceRoot: string;
  private resourceMap: Map<string, TypeResDefinition> = new Map();
  constructor(node: XMLNodeElement, resourceRoot: string) {
    this.node = node;
    this.resourceRoot = resourceRoot;
  }

  // 获取 url 解析数据
  getUrlData(url: string): {
    protocol: FILE_PROTOCOL | string;
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
   * <Color
   *     name="icon_title_text"
   *     description="颜色值测试"
   *     value="file://com.miui.home/theme_values.xml?name=icon_title_text"
   * />
   * ```
   * ->
   * ```json
   * {
   *   "tag": "Color",
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
  private getResDefinition(node: XMLNodeElement): TypeResDefinition {
    const value = node.getAttributeOf("value");
    const description = node.getAttributeOf("description");
    const { protocol, src, searchParams } = this.getUrlData(value);
    console.log({ protocol });
    const resDefinition = new ResDefinition()
      .set("type", node.getAttributeOf("type"))
      .set("name", node.getAttributeOf("name"))
      .set("desc", description);
    // 图片素材
    if (protocol === FILE_PROTOCOL.IMAGE) {
      const resImageData = new ResImageData();
      const file = this.resolvePath(src);
      if (fse.existsSync(file)) {
        resImageData.setBatch(getImageData(file));
      }
      resDefinition.set("protocol", protocol);
      resDefinition.set("data", resImageData.create());
      resDefinition.set("src", src);
    }
    // xml 素材
    if (protocol === FILE_PROTOCOL.XML) {
      // url 中的 name 参数
      // TODO： 先固定使用 name，后续看需求是否需要自定义其他属性去 xml 中查找
      const valueName = searchParams.get("name") || "";
      const defaultValue = new XmlTemplate(
        new XmlFileCompiler(this.resolvePath(src)).getElement()
      ).getTextByAttrName(valueName);
      const resValueData = new ResValueData()
        .set("valueName", valueName)
        .set("defaultValue", defaultValue)
        .create();
      resDefinition.set("protocol", protocol);
      resDefinition.set("data", resValueData);
      resDefinition.set("src", src);
    }
    return resDefinition.create();
  }

  getResDefinitionMap(): Map<string, TypeResDefinition> {
    if (this.resourceMap.size === 0) {
      this.node.getChildrenNodes().forEach(item => {
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
