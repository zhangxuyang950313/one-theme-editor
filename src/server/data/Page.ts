import path from "path";

import {
  TypeSourcePageConf,
  TypeSourcePageInfoConf,
  TypeSourcePageSourceConf,
  TypeSourceFileCategoryConf
} from "types/source-config";
import { TypeSourceLayout, TypeSourceOriginPageConf } from "types/xml-result";
import { getImageData } from "common/utils";
import { xml2jsonCompact } from "@/compiler/xml";
import { SOURCE_CONFIG_DIR } from "server/core/path-config";
import XMLNode from "@/core/XMLNode";

export default class Page {
  private rootDir: string;
  private pageFile: string;
  private xmlData!: TypeSourceOriginPageConf;
  constructor(pageFile: string, namespace: string) {
    this.pageFile = pageFile;
    this.rootDir = path.join(SOURCE_CONFIG_DIR, namespace);
  }

  private async ensureXmlData() {
    if (!this.xmlData) {
      this.xmlData = await xml2jsonCompact(this.pageFile);
    }
    return this.xmlData;
  }

  // 处理当前页面资源的相对路径
  private relativePathname(file: string) {
    return path.join(
      path.relative(this.rootDir, path.dirname(this.pageFile)),
      file
    );
  }

  // 处理当前页面资源的绝对路径
  private resolvePathname(file: string) {
    return path.join(path.dirname(this.pageFile), file);
  }

  async getPreview(): Promise<string> {
    const xmlData = await this.ensureXmlData();
    return this.relativePathname(
      new XMLNode(xmlData).getFirstChildOf("preview").getAttribute("src")
    );
  }

  async getConfig(): Promise<TypeSourcePageInfoConf> {
    const xmlData = await this.ensureXmlData();
    const configNode = new XMLNode(xmlData).getFirstChildOf("config");
    return {
      version: configNode.getAttribute("version"),
      description: configNode.getAttribute("description"),
      screenWidth: configNode.getAttribute("screenWidth")
    };
  }

  async getCategoryList(): Promise<TypeSourceFileCategoryConf[]> {
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

  async getSourceList(): Promise<TypeSourcePageSourceConf[]> {
    const xmlData = await this.ensureXmlData();
    const queue: Promise<TypeSourcePageSourceConf>[] =
      xmlData.source?.map(async item => {
        const currentNode = new XMLNode(item);
        const name =
          currentNode.getAttribute("description") ||
          currentNode.getAttribute("name");
        const layout: TypeSourceLayout = {};
        if (item.layout) {
          const layoutNode = currentNode.getFirstChildOf("layout");
          layout.x = layoutNode.getAttribute("x");
          layout.y = layoutNode.getAttribute("y");
          layout.w = layoutNode.getAttribute("w");
          layout.h = layoutNode.getAttribute("h");
          layout.align = layoutNode.getAttribute("align", "left");
          layout.alignV = layoutNode.getAttribute("alignV", "top");
        }
        const pathname = currentNode
          .getFirstChildOf("from")
          .getAttribute("src");
        const imageData = await getImageData(this.resolvePathname(pathname));
        const from = {
          pathname: this.relativePathname(pathname),
          ...imageData
        };
        const toNodes = currentNode.getChildrenOf("to");
        const to = toNodes.map(item => new XMLNode(item).getAttribute("src"));
        return { name, from, to, layout };
      }) || [];

    return Promise.all(queue);
  }

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

  async getData(): Promise<TypeSourcePageConf> {
    return {
      config: await this.getConfig(),
      preview: await this.getPreview(),
      category: await this.getCategoryList(),
      source: await this.getSourceList(),
      xml: []
    };
  }
}
