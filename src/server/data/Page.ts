import path from "path";

import {
  TypeSourcePageConf,
  TypeSourcePageInfoConf,
  TypeSourcePageSourceConf,
  TypeSourceFileCategoryConf
} from "types/source-config";
import { TypeTempLayout, TypeTempOriginPageConf } from "types/xml-result";
import { xml2jsonCompact } from "@/compiler/xml";
import { getImageData } from "common/utils";
import XMLNode from "@/core/XMLNode";

export default class Page {
  private file: string;
  private dirWithUIPath: string;
  private xmlData!: TypeTempOriginPageConf;
  constructor(file: string) {
    this.file = file;
    // this.pathname = props.pathname;
    this.dirWithUIPath = path.dirname(file);
  }

  private async ensureXmlData() {
    if (!this.xmlData) {
      this.xmlData = await xml2jsonCompact(this.file);
    }
    return this.xmlData;
  }

  async getPreview(): Promise<string> {
    const xmlData = await this.ensureXmlData();
    return xmlData.preview?.[0]._attributes.src || "";
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
    return (
      xmlData.category?.map(item => ({
        tag: item._attributes?.tag || "",
        description: item._attributes?.description || "",
        type: item._attributes?.type || ""
      })) || []
    );
  }

  async getSourceList(): Promise<TypeSourcePageSourceConf[]> {
    const xmlData = await this.ensureXmlData();
    const queue: Promise<TypeSourcePageSourceConf>[] =
      xmlData.source?.map(async item => {
        const layout: TypeTempLayout = {};
        if (item.layout) {
          const layoutNode = new XMLNode(item.layout[0]);
          layout.x = layoutNode.getAttribute("x");
          layout.y = layoutNode.getAttribute("y");
          layout.w = layoutNode.getAttribute("w");
          layout.h = layoutNode.getAttribute("h");
          layout.align = layoutNode.getAttribute("align", "left");
          layout.alignV = layoutNode.getAttribute("alignV", "top");
        }
        const fromSrc = path.resolve(
          this.dirWithUIPath,
          item.from?.[0]._attributes?.src || ""
        );
        const to = item.to
          ? item.to.map(item => path.join(item?._attributes?.src || ""))
          : [];
        const {
          md5,
          width,
          height,
          size,
          filename,
          ninePatch
        } = await getImageData(fromSrc);
        return {
          name: item?._attributes?.description || item?._attributes?.name || "",
          from: { md5, width, height, size, filename, ninePatch },
          to,
          layout
        };
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
      pathname: "",
      config: await this.getConfig(),
      preview: await this.getPreview(),
      category: await this.getCategoryList(),
      source: await this.getSourceList(),
      xml: []
    };
  }
}
