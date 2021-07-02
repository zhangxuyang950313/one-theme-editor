import path from "path";

import { Element } from "xml-js";
import {
  TypeSCPageConf,
  TypeSCPageRootConf,
  TypeSCFileCategoryConf,
  TypeSCPageTemplateConf,
  TypeSCPageCopyConf,
  TypeSCPageElementData,
  TypeElementAlign,
  TypeElementAlignV
} from "types/source-config";
import { getImageData } from "common/utils";
import { xml2jsonElements } from "server/compiler/xml";
import XMLNode from "server/core/XMLNode";
import XMLNodeElements from "server/core/XMLNodeElements";

enum ELEMENT_TYPES {
  IMAGE = "image",
  TEXT = "text"
}
export default class Page {
  private pageConfigFile: string;
  private xmlJson!: Element;
  constructor(file: string) {
    this.pageConfigFile = file;
  }

  private async ensureXmlData(): Promise<Element> {
    if (!this.xmlJson) {
      this.xmlJson = await xml2jsonElements(this.pageConfigFile);
    }
    return this.xmlJson;
  }

  // 处理当前页面资源的相对路径
  private relativePathname(file: string): string {
    return path.join(path.basename(path.dirname(this.pageConfigFile)), file);
  }

  // 处理当前页面资源的绝对路径
  private resolvePathname(file: string): string {
    return path.join(path.dirname(this.pageConfigFile), file);
  }

  private async getRootNode(): Promise<Element> {
    const xmlJson = await this.ensureXmlData();
    return xmlJson.elements?.[0] || {};
  }

  private async getRootAttribute(
    attribute: "version" | "description" | "screenWidth"
  ): Promise<string> {
    const rootNode = await this.getRootNode();
    return new XMLNodeElements(rootNode).getAttribute(attribute, "");
  }

  private async getRootElements(): Promise<Element[]> {
    const rootNode = await this.getRootNode();
    return rootNode.elements || [];
  }

  private async findRootMultiElements(tagname: string): Promise<Element[]> {
    const rootElements = await this.getRootElements();
    return rootElements.filter(item => item.name === tagname) || [];
  }

  async getVersion(): Promise<string> {
    return this.getRootAttribute("version");
  }

  async getDescription(): Promise<string> {
    return this.getRootAttribute("description");
  }

  async getScreenWidth(): Promise<string> {
    return this.getRootAttribute("screenWidth");
  }

  async getPreviewList(): Promise<string[]> {
    const previewNode = await this.findRootMultiElements("preview");
    return previewNode.map(item =>
      this.relativePathname(new XMLNodeElements(item).getAttribute("src"))
    );
  }

  async getConfig(): Promise<TypeSCPageRootConf> {
    return {
      version: await this.getVersion(),
      description: await this.getDescription(),
      screenWidth: await this.getScreenWidth()
    };
  }

  async getTemplateConfList(): Promise<TypeSCPageTemplateConf[]> {
    const templates = await this.findRootMultiElements("template");
    return templates.map(item => {
      const node = new XMLNodeElements(item);
      return {
        template: this.relativePathname(node.getAttribute("src")),
        values: this.relativePathname(node.getAttribute("values")),
        to: node.getAttribute("to")
      };
    });
  }

  async getCopyConfList(): Promise<TypeSCPageCopyConf[]> {
    return (await this.findRootMultiElements("copy")).map(item => {
      const copyNode = new XMLNodeElements(item);
      return {
        from: this.relativePathname(copyNode.getAttribute("from")),
        to: copyNode.getAttribute("to")
      };
    });
  }

  async getLayoutElementList(): Promise<TypeSCPageElementData[]> {
    const rootNode = await this.getRootNode();
    const layoutNode = new XMLNodeElements(rootNode).getChildOf("layout");
    const elementList = new XMLNodeElements(layoutNode).getChildren();
    const queue: Promise<TypeSCPageElementData>[] = [];
    elementList.forEach(async item => {
      const currentNode = new XMLNodeElements(item);
      const layoutNormalize = {
        x: currentNode.getAttribute("x"),
        y: currentNode.getAttribute("y"),
        align: currentNode.getAttribute("align", "left") as TypeElementAlign,
        alignV: currentNode.getAttribute("alignV", "right") as TypeElementAlignV
      };
      const solveElement = new Promise<TypeSCPageElementData>(async resolve => {
        switch (item.name) {
          case ELEMENT_TYPES.IMAGE: {
            resolve({
              type: ELEMENT_TYPES.IMAGE,
              name: currentNode.getAttribute("name"),
              src: {
                ...(await getImageData(
                  this.resolvePathname(currentNode.getAttribute("src"))
                )),
                relativePath: this.relativePathname(
                  currentNode.getAttribute("src")
                )
              },
              layout: {
                x: layoutNormalize.x,
                y: layoutNormalize.y,
                w: currentNode.getAttribute("w"),
                h: currentNode.getAttribute("h"),
                align: layoutNormalize.align,
                alignV: layoutNormalize.alignV
              },
              to: currentNode
                .getChildrenOf("to")
                .map(item => new XMLNodeElements(item).getTextChild())
            });
            break;
          }
          case ELEMENT_TYPES.TEXT: {
            resolve({
              type: ELEMENT_TYPES.TEXT,
              text: currentNode.getAttribute("text"),
              layout: layoutNormalize,
              colorClass: currentNode.getAttribute("colorClass"),
              color: currentNode.getAttribute("color")
            });
            break;
          }
        }
      });
      queue.push(solveElement);
    });
    return Promise.all(queue);
  }

  async getCategoryList(): Promise<TypeSCFileCategoryConf[]> {
    const xmlData = await this.ensureXmlData();
    const categoryNodes = new XMLNode(xmlData).getChildrenOf("category");
    return categoryNodes.map(item => {
      const categoryNode = new XMLNode(item);
      return {
        tag: categoryNode.getAttribute("tag"),
        description: categoryNode.getAttribute("description"),
        type: categoryNode.getAttribute("type")
      };
    });
  }

  // async getSourceList(): Promise<TypeSCPageSourceConf[]> {
  //   const xmlData = await this.ensureXmlData();
  //   const queue: Promise<TypeSCPageSourceConf>[] =
  //     xmlData.source?.map(async item => {
  //       const currentNode = new XMLNode(item);
  //       const name =
  //         currentNode.getAttribute("description") ||
  //         currentNode.getAttribute("name");
  //       const layout: TypeXMLSourceLayout = {};
  //       if (item.layout) {
  //         const layoutNode = currentNode.getFirstChildOf("layout");
  //         layout.x = layoutNode.getAttribute("x");
  //         layout.y = layoutNode.getAttribute("y");
  //         layout.w = layoutNode.getAttribute("w");
  //         layout.h = layoutNode.getAttribute("h");
  //         layout.align = layoutNode.getAttribute("align", "left");
  //         layout.alignV = layoutNode.getAttribute("alignV", "top");
  //       }
  //       const pathname = currentNode
  //         .getFirstChildOf("from")
  //         .getAttribute("src");
  //       const imageData = await getImageData(this.resolvePathname(pathname));
  //       const from: TypeSCPageSourceConf["from"] = {
  //         relativePath: this.relativePathname(pathname),
  //         ...imageData
  //       };
  //       const toNodes = currentNode.getChildrenOf("to");
  //       const to = toNodes.map(item => new XMLNode(item).getAttribute("src"));
  //       return { name, from, to, layout };
  //     }) || [];

  //   return Promise.all(queue);
  // }

  // async getColorList() {
  //   const xmlData = await this.ensureXmlData();
  // }

  // async getIntegerList() {
  //   const xmlData = await this.ensureXmlData();
  // }

  // async getBoolList() {
  //   const xmlData = await this.ensureXmlData();
  // }

  // async getDimenList() {
  //   const xmlData = await this.ensureXmlData();
  // }

  async getData(): Promise<TypeSCPageConf> {
    return {
      config: await this.getConfig(),
      preview: await this.getPreviewList(),
      category: await this.getCategoryList(),
      elements: await this.getLayoutElementList(),
      copyList: await this.getCopyConfList(),
      xml: []
    };
  }
}
