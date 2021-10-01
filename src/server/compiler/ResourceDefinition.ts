import path from "path";
import { URL, URLSearchParams } from "url";
import fse from "fs-extra";
import {
  DefinitionImageData,
  DefinitionValueData,
  SourceDefinitionData
} from "src/data/ResourceConfig";
import { filenameIsImage, filenameIsXml, getImageData } from "src/utils/index";
import { TypeResourceDefinition } from "src/types/resource";
import XMLNodeElement from "server/compiler/XMLNodeElement";
import XmlTemplate from "./XmlTemplate";
import XmlFileCompiler from "./XmlFileCompiler";

/**
 * 解析素材定义数据
 */
export default class ResourceDefinition {
  private node: XMLNodeElement;
  private resourceRoot: string;
  private resourceMap: Map<string, TypeResourceDefinition> = new Map();
  constructor(node: XMLNodeElement, resourceRoot: string) {
    this.node = node;
    this.resourceRoot = resourceRoot;
  }

  // 获取 url 解析数据
  getUrlData(url: string): { src: string; searchParams: URLSearchParams } {
    const data = new URL(url);
    return {
      src: path.join(data.hostname, data.pathname),
      searchParams: data.searchParams
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
  private getResourceData(node: XMLNodeElement): TypeResourceDefinition {
    const value = node.getAttributeOf("value");
    const description = node.getAttributeOf("description");
    const { src, searchParams } = this.getUrlData(value);
    const resourceData = new SourceDefinitionData()
      .set("tagName", node.getTagname())
      .set("name", node.getAttributeOf("name"))
      .set("description", description);
    // 图片素材
    if (filenameIsImage(src)) {
      const definitionImageData = new DefinitionImageData();
      const file = this.resolvePath(src);
      if (fse.existsSync(file)) {
        const imageData = getImageData(file);
        definitionImageData
          .set("width", imageData.width)
          .set("height", imageData.height)
          .set("size", imageData.size)
          .set("ninePatch", imageData.ninePatch)
          .set("filename", imageData.filename);
      }
      resourceData
        .set("resourceData", definitionImageData.create())
        .set("src", src);
    }
    // xml 素材
    if (filenameIsXml(src)) {
      // url 中的 name 参数
      // TODO： 先固定使用 name，后续看需求是否需要自定义其他属性去 xml 中查找
      const valueName = searchParams.get("name") || "";
      const defaultValue = new XmlTemplate(
        new XmlFileCompiler(this.resolvePath(src)).getElement()
      ).getTextByAttrName(valueName);
      const valueData = new DefinitionValueData()
        .set("valueName", valueName)
        .set("defaultValue", defaultValue)
        .create();
      resourceData.set("valueData", valueData).set("src", src);
    }
    return resourceData.create();
  }

  getResourceMap(): Map<string, TypeResourceDefinition> {
    if (this.resourceMap.size === 0) {
      this.node.getChildrenNodes().forEach(item => {
        const name = item.getAttributeOf("name");
        const value = item.getAttributeOf("value");
        if (name && value) {
          const resourceData = this.getResourceData(item);
          this.resourceMap.set(name, resourceData);
        }
      });
    }
    return this.resourceMap;
  }

  getResourceList(): TypeResourceDefinition[] {
    const result: TypeResourceDefinition[] = [];
    this.getResourceMap().forEach(item => result.push(item));
    return result;
  }

  getResourceByName(name: string): TypeResourceDefinition | null {
    return this.getResourceMap().get(name) || null;
  }
}
