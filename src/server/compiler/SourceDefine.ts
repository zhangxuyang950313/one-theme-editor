import path from "path";
import { URL, URLSearchParams } from "url";
import {
  DefineSourceData,
  DefineValueData,
  SourceValueDefine
} from "data/SourceConfig";
import { filenameIsImage, filenameIsXml, getImageData } from "common/utils";
import { TypeSourceDefine } from "types/source-config";
import XMLNodeElement from "server/compiler/XMLNodeElement";
import XmlTemplate from "./XmlTemplate";

/**
 * 解析素材定义数据
 */
export default class SourceDefine {
  private node: XMLNodeElement;
  private sourceRoot: string;
  private sourceDefineMap: Map<string, TypeSourceDefine> = new Map();
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
  private resolveRootSourcePath(pathname: string): string {
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
  private getSourceDefineData(node: XMLNodeElement): TypeSourceDefine {
    const value = node.getAttributeOf("value");
    const description = node.getAttributeOf("description");
    const { src, searchParams } = this.getUrlData(value);
    const sourceValueDefineData = new SourceValueDefine()
      .set("tagName", node.getTagname())
      .set("name", node.getAttributeOf("name"))
      .set("description", description);
    // 图片素材
    if (filenameIsImage(src)) {
      const imageData = getImageData(this.resolveRootSourcePath(src));
      const sourceData = new DefineSourceData()
        .set("width", imageData.width)
        .set("height", imageData.height)
        .set("size", imageData.size)
        .set("ninePatch", imageData.ninePatch)
        .set("filename", imageData.filename)
        .set("src", src)
        .create();
      sourceValueDefineData.set("sourceData", sourceData);
    }
    // xml 素材
    if (filenameIsXml(src)) {
      // url 中的 name 参数
      // TODO： 先固定使用 name，后续看需求是否需要自定义其他属性去 xml 中查找
      const valueName = searchParams.get("name") || "";
      const defaultValue = new XmlTemplate(
        this.resolveRootSourcePath(src)
      ).getTextByAttrName(valueName);
      const valueData = new DefineValueData()
        .set("src", src)
        .set("valueName", valueName)
        .set("defaultValue", defaultValue)
        .create();
      sourceValueDefineData.set("valueData", valueData);
    }
    return sourceValueDefineData.create();
  }

  getSourceDefineMap(): Map<string, TypeSourceDefine> {
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

  getSourceDefineList(): TypeSourceDefine[] {
    const result: TypeSourceDefine[] = [];
    this.getSourceDefineMap().forEach(item => result.push(item));
    return result;
  }

  getSourceDefineByName(name: string): TypeSourceDefine | null {
    return this.getSourceDefineMap().get(name) || null;
  }
}
