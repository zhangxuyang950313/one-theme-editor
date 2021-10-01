import path from "path";
import { URL, URLSearchParams } from "url";
import fse from "fs-extra";
import {
  DefinedImageData,
  DefinedValueData,
  SourceDefinedData
} from "src/data/ResourceConfig";
import { filenameIsImage, filenameIsXml, getImageData } from "src/utils/index";
import { TypeResourceDefined } from "src/types/resource";
import XMLNodeElement from "server/compiler/XMLNodeElement";
import XmlTemplate from "./XmlTemplate";
import XmlFileCompiler from "./XmlFileCompiler";

/**
 * 解析素材定义数据
 */
export default class ResourceDefine {
  private node: XMLNodeElement;
  private resourceRoot: string;
  private resourceDefineMap: Map<string, TypeResourceDefined> = new Map();
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
  private resolveRootPath(pathname: string): string {
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
  private getResourceDefineData(node: XMLNodeElement): TypeResourceDefined {
    const value = node.getAttributeOf("value");
    const description = node.getAttributeOf("description");
    const { src, searchParams } = this.getUrlData(value);
    const resourceDefineData = new SourceDefinedData()
      .set("tagName", node.getTagname())
      .set("name", node.getAttributeOf("name"))
      .set("description", description);
    // 图片素材
    if (filenameIsImage(src)) {
      const definedImageData = new DefinedImageData();
      const file = this.resolveRootPath(src);
      if (fse.existsSync(file)) {
        const imageData = getImageData(file);
        definedImageData
          .set("width", imageData.width)
          .set("height", imageData.height)
          .set("size", imageData.size)
          .set("ninePatch", imageData.ninePatch)
          .set("filename", imageData.filename);
      }
      resourceDefineData
        .set("resourceData", definedImageData.create())
        .set("src", src);
    }
    // xml 素材
    if (filenameIsXml(src)) {
      // url 中的 name 参数
      // TODO： 先固定使用 name，后续看需求是否需要自定义其他属性去 xml 中查找
      const valueName = searchParams.get("name") || "";
      const defaultValue = new XmlTemplate(
        new XmlFileCompiler(this.resolveRootPath(src)).getElement()
      ).getTextByAttrName(valueName);
      const valueData = new DefinedValueData()
        .set("valueName", valueName)
        .set("defaultValue", defaultValue)
        .create();
      resourceDefineData.set("valueData", valueData).set("src", src);
    }
    return resourceDefineData.create();
  }

  getResourceDefineMap(): Map<string, TypeResourceDefined> {
    if (this.resourceDefineMap.size === 0) {
      this.node.getChildrenNodes().forEach(item => {
        const name = item.getAttributeOf("name");
        const value = item.getAttributeOf("value");
        if (name && value) {
          const resourceDefineData = this.getResourceDefineData(item);
          this.resourceDefineMap.set(name, resourceDefineData);
        }
      });
    }
    return this.resourceDefineMap;
  }

  getResourceDefineList(): TypeResourceDefined[] {
    const result: TypeResourceDefined[] = [];
    this.getResourceDefineMap().forEach(item => result.push(item));
    return result;
  }

  getResourceDefineByName(name: string): TypeResourceDefined | null {
    return this.getResourceDefineMap().get(name) || null;
  }
}
