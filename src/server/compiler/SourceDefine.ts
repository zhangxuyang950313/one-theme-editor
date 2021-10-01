import path from "path";
import { URL, URLSearchParams } from "url";
import fse from "fs-extra";
import {
  DefinedImageData,
  DefinedValueData,
  SourceDefinedData
} from "src/data/SourceConfig";
import { filenameIsImage, filenameIsXml, getImageData } from "src/utils/index";
import { TypeSourceDefined } from "src/types/source";
import XMLNodeElement from "server/compiler/XMLNodeElement";
import XmlTemplate from "./XmlTemplate";
import XmlFileCompiler from "./XmlFileCompiler";

/**
 * 解析素材定义数据
 */
export default class SourceDefine {
  private node: XMLNodeElement;
  private sourceRoot: string;
  private sourceDefineMap: Map<string, TypeSourceDefined> = new Map();
  constructor(node: XMLNodeElement, sourceRoot: string) {
    this.node = node;
    this.sourceRoot = sourceRoot;
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
  private resolveSourceRootPath(pathname: string): string {
    return path.join(this.sourceRoot, pathname);
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
  private getSourceDefineData(node: XMLNodeElement): TypeSourceDefined {
    const value = node.getAttributeOf("value");
    const description = node.getAttributeOf("description");
    const { src, searchParams } = this.getUrlData(value);
    const sourceDefineData = new SourceDefinedData()
      .set("tagName", node.getTagname())
      .set("name", node.getAttributeOf("name"))
      .set("description", description);
    // 图片素材
    if (filenameIsImage(src)) {
      const sourceData = new DefinedImageData();
      const file = this.resolveSourceRootPath(src);
      if (fse.existsSync(file)) {
        const imageData = getImageData(file);
        sourceData
          .set("width", imageData.width)
          .set("height", imageData.height)
          .set("size", imageData.size)
          .set("ninePatch", imageData.ninePatch)
          .set("filename", imageData.filename);
      }
      sourceDefineData.set("sourceData", sourceData.create()).set("src", src);
    }
    // xml 素材
    if (filenameIsXml(src)) {
      // url 中的 name 参数
      // TODO： 先固定使用 name，后续看需求是否需要自定义其他属性去 xml 中查找
      const valueName = searchParams.get("name") || "";
      const defaultValue = new XmlTemplate(
        new XmlFileCompiler(this.resolveSourceRootPath(src)).getElement()
      ).getTextByAttrName(valueName);
      const valueData = new DefinedValueData()
        .set("valueName", valueName)
        .set("defaultValue", defaultValue)
        .create();
      sourceDefineData.set("valueData", valueData).set("src", src);
    }
    return sourceDefineData.create();
  }

  getSourceDefineMap(): Map<string, TypeSourceDefined> {
    if (this.sourceDefineMap.size === 0) {
      this.node.getChildrenNodes().forEach(item => {
        const name = item.getAttributeOf("name");
        const value = item.getAttributeOf("value");
        if (name && value) {
          const sourceDefineData = this.getSourceDefineData(item);
          this.sourceDefineMap.set(name, sourceDefineData);
        }
      });
    }
    return this.sourceDefineMap;
  }

  getSourceDefineList(): TypeSourceDefined[] {
    const result: TypeSourceDefined[] = [];
    this.getSourceDefineMap().forEach(item => result.push(item));
    return result;
  }

  getSourceDefineByName(name: string): TypeSourceDefined | null {
    return this.getSourceDefineMap().get(name) || null;
  }
}
