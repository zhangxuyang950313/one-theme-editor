import path from "path";

import { Element } from "xml-js";
import {
  TypeSCPageConf,
  TypeSCPageTemplateConf,
  TypeSCPageCopyConf,
  TypeSCPageElementData,
  TypeElementAlign,
  TypeElementAlignV
} from "types/source-config";
import { getImageData, asyncMap } from "common/utils";
import { xml2jsonElements } from "server/compiler/xml";
import XMLNodeElement from "server/core/XMLNodeElements";
import TempKeyValMapper from "server/data/TempKeyValMapper";

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
    return new XMLNodeElement(rootNode).getAttribute(attribute, "");
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
      this.relativePathname(new XMLNodeElement(item).getAttribute("src"))
    );
  }

  async getTemplateConfList(): Promise<TypeSCPageTemplateConf[]> {
    const templates = await this.findRootMultiElements("template");
    return await asyncMap(templates, async item => {
      const node = new XMLNodeElement(item);
      const valueList = await new TempKeyValMapper(
        this.resolvePathname(node.getAttribute("values"))
      ).getDataList();
      return {
        template: this.relativePathname(node.getAttribute("src")),
        valueList: valueList,
        to: node.getAttribute("to")
      };
    });
  }

  async getCopyConfList(): Promise<TypeSCPageCopyConf[]> {
    return (await this.findRootMultiElements("copy")).map(item => {
      const copyNode = new XMLNodeElement(item);
      return {
        from: this.relativePathname(copyNode.getAttribute("from")),
        to: copyNode.getAttribute("to")
      };
    });
  }

  async getLayoutElementList(): Promise<TypeSCPageElementData[]> {
    const rootNode = await this.getRootNode();
    const elementList = new XMLNodeElement(rootNode)
      .getChildOf("layout")
      .getChildren();
    const queue: Promise<TypeSCPageElementData>[] = [];
    elementList.forEach(async item => {
      const currentNode = new XMLNodeElement(item);
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
              source: {
                ...(await getImageData(
                  this.resolvePathname(currentNode.getAttribute("src"))
                )),
                pathname: this.relativePathname(currentNode.getAttribute("src"))
              },
              layout: {
                x: layoutNormalize.x,
                y: layoutNormalize.y,
                w: currentNode.getAttribute("w"),
                h: currentNode.getAttribute("h"),
                align: layoutNormalize.align,
                alignV: layoutNormalize.alignV
              },
              toList: currentNode
                .getChildrenOf("to")
                .map(item => new XMLNodeElement(item).getChildText())
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

  async getData(): Promise<TypeSCPageConf> {
    return {
      version: await this.getVersion(),
      description: await this.getDescription(),
      screenWidth: await this.getScreenWidth(),
      previewList: await this.getPreviewList(),
      elementList: await this.getLayoutElementList(),
      templateList: await this.getTemplateConfList(),
      copyList: await this.getCopyConfList()
    };
  }
}
