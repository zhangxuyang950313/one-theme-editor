import path from "path";
import PATHS from "server/core/pathUtils";
import { getImageData } from "common/utils";
import { ELEMENT_TYPES, ALIGN_VALUES, ALIGN_V_VALUES } from "src/enum/index";
import {
  TypeSourceXmlTempConf,
  TypeSourceCopyConf,
  TypeSourceElement,
  TypeSourcePageData,
  TypeSourceImageElement,
  TypeSourceTextElement
} from "types/source-config";
import XMLNodeElement from "server/compiler/XMLNodeElement";
import TempKeyValMapper from "./TempKeyValMapper";
import BaseCompiler from "./BaseCompiler";
import XmlTemplate from "./XmlTemplate";

export default class PageConfig extends BaseCompiler {
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
    const previewNodeList = super.getRootChildrenOf("preview");
    return previewNodeList.map(item =>
      this.relativePath(item.getAttributeOf("src"))
    );
  }

  getXmlTempConfList(): TypeSourceXmlTempConf[] {
    return super
      .getRootChildrenOf("template")
      .map<TypeSourceXmlTempConf>(node => {
        const value = node.getAttributeOf("value");
        const src = node.getAttributeOf("src");
        const release =
          node.getAttributeOf("to") || node.getAttributeOf("release");
        const prefix = `template 缺少`;
        const suffix = `(${super.getFileName()})`;
        if (!value) throw new Error(`${prefix} value 属性 ${suffix}`);
        if (!src) throw new Error(`${prefix} src 属性 ${suffix}`);
        if (!release) throw new Error(`${prefix} to/release 属性 ${suffix}`);

        const valueMap = new TempKeyValMapper(
          this.resolvePath(value)
        ).getDataObj();
        const template = this.relativePath(src);
        return { template, release, valueMap };
      });
  }

  getCopyConfList(): TypeSourceCopyConf[] {
    return super.getRootChildrenOf("copy").map<TypeSourceCopyConf>(node => ({
      from: this.relativePath(node.getAttributeOf("from")),
      release: node.getAttributeOf("to", node.getAttributeOf("release"))
    }));
  }

  private layoutConf(node: XMLNodeElement) {
    return {
      x: node.getAttributeOf("x"),
      y: node.getAttributeOf("y"),
      w: node.getAttributeOf("w"),
      h: node.getAttributeOf("h"),
      align: node.getAttributeOf("align", ALIGN_VALUES.LEFT),
      alignV: node.getAttributeOf("alignV", ALIGN_V_VALUES.TOP)
    };
  }

  private imageElement(node: XMLNodeElement): TypeSourceImageElement {
    const src = node.getAttributeOf("src");
    const source = {
      ...getImageData(this.resolvePath(src)),
      url: this.relativePath(src)
    };
    const releaseList = node
      .getChildrenNodesByTagname("to")
      .map(item => item.getFirstTextChildValue() || item.getAttributeOf("src"));
    return {
      type: ELEMENT_TYPES.IMAGE,
      name: node.getAttributeOf("name"),
      source,
      layout: this.layoutConf(node),
      releaseList
    };
  }

  private textElement(node: XMLNodeElement): TypeSourceTextElement {
    const layout = this.layoutConf(node);
    return {
      type: ELEMENT_TYPES.TEXT,
      text: node.getAttributeOf("text"),
      layout: {
        x: layout.x,
        y: layout.y,
        align: layout.align,
        alignV: layout.alignV
      },
      color: node.getAttributeOf("color")
    };
  }

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
      templateList: this.getXmlTempConfList(),
      copyList: this.getCopyConfList()
    };
  }
}
