import path from "path";
import PATHS from "server/core/pathUtils";
import { getImageData } from "common/utils";
import { ELEMENT_TYPES, ALIGN_VALUES, ALIGN_V_VALUES } from "src/enum/index";
import {
  TypeSCPageTemplateConf,
  TypeSCPageCopyConf,
  TypeSCPageSourceElement,
  TypeSCPageData
} from "types/source-config";
import TempKeyValMapper from "./TempKeyValMapper";
import BaseCompiler from "./BaseCompiler";
import XmlTemplate from "./XmlTemplate";

export default class Page extends BaseCompiler {
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

  getTemplateConfList(): TypeSCPageTemplateConf[] {
    const templates = super.getRootChildrenOf("template");
    return templates.map(node => {
      const templateData = new XmlTemplate(
        this.resolvePath(node.getAttributeOf("src"))
      ).getElementList();
      const valueMapData = new TempKeyValMapper(
        this.resolvePath(node.getAttributeOf("values"))
      ).getDataObj();
      const data: TypeSCPageTemplateConf = {
        template: templateData,
        valueMap: valueMapData,
        to: node.getAttributeOf("to")
      };
      return data;
    });
  }

  getCopyConfList(): TypeSCPageCopyConf[] {
    return super.getRootChildrenOf("copy").map(node => ({
      from: this.relativePath(node.getAttributeOf("from")),
      to: node.getAttributeOf("to")
    }));
  }

  getLayoutElementList(): TypeSCPageSourceElement[] {
    const rootNode = this.getRootNode();
    const elementList = rootNode.getFirstChildOf("layout").getChildren();
    const result: TypeSCPageSourceElement[] = [];
    elementList.forEach(node => {
      const layoutNormalize = {
        x: node.getAttributeOf("x"),
        y: node.getAttributeOf("y"),
        align: node.getAttributeOf("align", ALIGN_VALUES.LEFT),
        alignV: node.getAttributeOf("alignV", ALIGN_V_VALUES.TOP)
      };
      switch (node.getTagname()) {
        case ELEMENT_TYPES.IMAGE: {
          const src = node.getAttributeOf("src");
          result.push({
            type: ELEMENT_TYPES.IMAGE,
            name: node.getAttributeOf("name"),
            source: {
              ...getImageData(this.resolvePath(src)),
              pathname: this.relativePath(src)
            },
            layout: {
              x: layoutNormalize.x,
              y: layoutNormalize.y,
              w: node.getAttributeOf("w"),
              h: node.getAttributeOf("h"),
              align: layoutNormalize.align,
              alignV: layoutNormalize.alignV
            },
            releaseList: node
              .getChildrenOf("to")
              .map(item => item.getFirstTextChildValue())
          });
          break;
        }
        case ELEMENT_TYPES.TEXT: {
          result.push({
            type: ELEMENT_TYPES.TEXT,
            text: node.getAttributeOf("text"),
            layout: layoutNormalize,
            color: node.getAttributeOf("color")
          });
        }
      }
    });
    return result;
  }

  getData(): TypeSCPageData {
    return {
      version: this.getVersion(),
      description: this.getDescription(),
      screenWidth: this.getScreenWidth(),
      previewList: this.getPreviewList(),
      elementList: this.getLayoutElementList(),
      templateList: this.getTemplateConfList(),
      copyList: this.getCopyConfList()
    };
  }
}
