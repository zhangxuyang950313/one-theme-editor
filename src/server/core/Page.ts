import path from "path";
import {
  TypeTempPageConf,
  TypeTempPageConfigConf,
  TypeTempPageSourceConf,
  TypeTempPageCategoryConf
} from "types/project";
import { TypeTempLayout, TypeTempOriginPageConf } from "types/xml-result";
import { getImageUrlByAbsPath } from "@/db-handler/image";
import { xml2jsonCompact } from "./xmlCompiler";
import XMLNode from "./XMLNode";

export default class Page {
  private file: string;
  private dirWithUiPath: string;
  private pathname: string;
  private uiPath: string;
  private xmlData!: TypeTempOriginPageConf;
  constructor(props: { file: string; pathname: string; uiPath: string }) {
    this.file = props.file;
    this.pathname = props.pathname;
    this.uiPath = props.uiPath;
    this.dirWithUiPath = path.dirname(props.file);
  }

  private async ensureXmlData() {
    if (!this.xmlData) {
      this.xmlData = await xml2jsonCompact(this.file);
    }
    return this.xmlData;
  }

  async getPreview(): Promise<string> {
    const xmlData = await this.ensureXmlData();
    const previewSrc = path.join(
      this.dirWithUiPath,
      xmlData.preview?.[0]._attributes.src || ""
    );
    return getImageUrlByAbsPath(previewSrc);
  }

  async getConfig(): Promise<TypeTempPageConfigConf> {
    const xmlData = await this.ensureXmlData();
    return {
      version: xmlData.config?.[0]._attributes?.version || "",
      description: xmlData.config?.[0]._attributes?.description || "",
      screenWidth: xmlData.config?.[0]._attributes?.screenWidth || ""
    };
  }

  async getCategoryList(): Promise<TypeTempPageCategoryConf[]> {
    const xmlData = await this.ensureXmlData();
    return (
      xmlData.category?.map(item => ({
        tag: item._attributes?.tag || "",
        description: item._attributes?.description || "",
        type: item._attributes?.type || ""
      })) || []
    );
  }

  async getSourceList(): Promise<TypeTempPageSourceConf[]> {
    const xmlData = await this.ensureXmlData();
    const queue =
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
        const description = item?._attributes?.description || "";
        const fromSrc = path.resolve(
          this.dirWithUiPath,
          item.from?.[0]._attributes?.src || ""
        );
        const fromUrl = await getImageUrlByAbsPath(fromSrc);
        const to = item.to
          ? item.to.map(item =>
              path.join(this.uiPath, item?._attributes?.src || "")
            )
          : [];
        return { description, layout, from: fromUrl, to };
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

  async getData(): Promise<TypeTempPageConf> {
    return {
      pathname: this.pathname,
      config: await this.getConfig(),
      preview: await this.getPreview(),
      category: await this.getCategoryList(),
      source: await this.getSourceList(),
      xml: []
    };
  }
}
