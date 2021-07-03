import path from "path";
import { getImageData, asyncMap } from "common/utils";
import { ELEMENT_TYPES } from "src/enum/index";
import {
  TypeSCPageConf,
  TypeSCPageTemplateConf,
  TypeSCPageCopyConf,
  TypeSCPageElementData,
  TypeElementAlign,
  TypeElementAlignV
} from "types/source-config";
import TempKeyValMapper from "./TempKeyValMapper";
import BaseCompiler from "./BaseCompiler";

export default class Page extends BaseCompiler {
  // 处理当前页面资源的相对路径
  private relativePathname(file: string): string {
    return path.join(path.basename(path.dirname(this.getFile())), file);
  }

  // 处理当前页面资源的绝对路径
  private resolvePathname(file: string): string {
    return path.join(path.dirname(this.getFile()), file);
  }

  private async getRootAttribute(
    attribute: "version" | "description" | "screenWidth"
  ): Promise<string> {
    return (await this.getRootNode()).getAttributeOf(attribute);
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
    const previewNode = await super.getRootChildrenOf("preview");
    return previewNode.map(item =>
      this.relativePathname(item.getAttributeOf("src"))
    );
  }

  async getTemplateConfList(): Promise<TypeSCPageTemplateConf[]> {
    const templates = await super.getRootChildrenOf("template");
    return await asyncMap(templates, async node => {
      const valueList = await new TempKeyValMapper(
        this.resolvePathname(node.getAttributeOf("values"))
      ).getDataList();
      return {
        template: this.relativePathname(node.getAttributeOf("src")),
        valueList: valueList,
        to: node.getAttributeOf("to")
      };
    });
  }

  async getCopyConfList(): Promise<TypeSCPageCopyConf[]> {
    return (await super.getRootChildrenOf("copy")).map(node => {
      return {
        from: this.relativePathname(node.getAttributeOf("from")),
        to: node.getAttributeOf("to")
      };
    });
  }

  async getLayoutElementList(): Promise<TypeSCPageElementData[]> {
    const rootNode = await this.getRootNode();
    const elementList = rootNode.getFirstChildOf("layout").getChildren();
    const queue: Promise<TypeSCPageElementData>[] = [];
    elementList.forEach(async node => {
      const layoutNormalize = {
        x: node.getAttributeOf("x"),
        y: node.getAttributeOf("y"),
        align: node.getAttributeOf("align", "left") as TypeElementAlign,
        alignV: node.getAttributeOf("alignV", "right") as TypeElementAlignV
      };
      const solveElement = new Promise<TypeSCPageElementData>(async resolve => {
        switch (node.getTagname()) {
          case ELEMENT_TYPES.IMAGE: {
            resolve({
              type: ELEMENT_TYPES.IMAGE,
              name: node.getAttributeOf("name"),
              source: {
                ...(await getImageData(
                  this.resolvePathname(node.getAttributeOf("src"))
                )),
                pathname: this.relativePathname(node.getAttributeOf("src"))
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
                .map(item => item.getChildText())
            });
            break;
          }
          case ELEMENT_TYPES.TEXT: {
            resolve({
              type: ELEMENT_TYPES.TEXT,
              text: node.getAttributeOf("text"),
              layout: layoutNormalize,
              colorClass: node.getAttributeOf("colorClass"),
              color: node.getAttributeOf("color")
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
