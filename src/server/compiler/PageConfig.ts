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
    const templates = super.getRootChildrenOf("template");
    return templates.map(node => {
      const templateData = new XmlTemplate(
        this.resolvePath(node.getAttributeOf("src"))
      ).getElementList();
      const valueMapData = new TempKeyValMapper(
        this.resolvePath(node.getAttributeOf("values"))
      ).getDataObj();
      const data: TypeSourceXmlTempConf = {
        template: templateData,
        valueMap: valueMapData,
        to: node.getAttributeOf("to")
      };
      return data;
    });
  }

  getCopyConfList(): TypeSourceCopyConf[] {
    return super.getRootChildrenOf("copy").map(node => ({
      from: this.relativePath(node.getAttributeOf("from")),
      to: node.getAttributeOf("to")
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
    return {
      type: ELEMENT_TYPES.IMAGE,
      name: node.getAttributeOf("name"),
      source: {
        ...getImageData(this.resolvePath(src)),
        pathname: this.relativePath(src)
      },
      layout: this.layoutConf(node),
      releaseList: node
        .getChildrenOf("to")
        .map(item => item.getFirstTextChildValue())
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
    const elementList = rootNode.getFirstChildOf("layout").getChildren();
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
