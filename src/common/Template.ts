import path from "path";
import errCode from "renderer/core/error-code";
import { xml2jsonCompact } from "common/xmlCompiler";
import {
  TypeTempPageGroupConf,
  TypeTemplateInfo,
  TypeTempModuleConf,
  TypeTempPageConf,
  TypeTempPageConfigConf,
  TypeTempPageSourceConf,
  TypeUiVersionConf
} from "types/project";
import {
  TypeOriginTempConf,
  TypeOriginTempPageGroupConf,
  TypeOriginTempModulePageConf,
  TypeTempLayout,
  TypeTempOriginPageConf
} from "types/xml-result";
import TemplateInfo from "src/data/TemplateInfo";
import XMLNode from "common/XMLNode";
import { TypeTempPageCategoryConf } from "./../types/project.d";

export class Page {
  private file: string;
  private dir: string;
  private pathname: string;
  private uiPath: string;
  private xmlData!: TypeTempOriginPageConf;
  constructor(props: { file: string; pathname: string; uiPath: string }) {
    this.file = props.file;
    this.pathname = props.pathname;
    this.uiPath = props.uiPath;
    this.dir = path.dirname(props.file);
  }

  private async ensureXmlData() {
    if (!this.xmlData) {
      this.xmlData = await xml2jsonCompact(this.file);
    }
    return this.xmlData;
  }

  async getPreview(): Promise<string> {
    const xmlData = await this.ensureXmlData();
    return path.join(this.uiPath, xmlData.preview?.[0]._attributes.src || "");
  }

  async getConfig(): Promise<TypeTempPageConfigConf> {
    const xmlData = await this.ensureXmlData();
    return {
      version: xmlData.config?.[0]._attributes.version || "",
      description: xmlData.config?.[0]._attributes.description || "",
      screenWidth: xmlData.config?.[0]._attributes.screenWidth || ""
    };
  }

  async getCategoryList(): Promise<TypeTempPageCategoryConf[]> {
    const xmlData = await this.ensureXmlData();
    return (
      xmlData.category?.map(item => ({
        tag: item._attributes.tag || "",
        description: item._attributes.description || "",
        type: item._attributes.type || ""
      })) || []
    );
  }

  async getSourceList(): Promise<TypeTempPageSourceConf[]> {
    const xmlData = await this.ensureXmlData();
    return (
      xmlData.source?.map(item => {
        const layout: TypeTempLayout = {};
        if (item.layout) {
          const layoutNode = new XMLNode(item.layout);
          layout.x = layoutNode.getAttribute("x");
          layout.y = layoutNode.getAttribute("y");
          layout.w = layoutNode.getAttribute("w");
          layout.h = layoutNode.getAttribute("h");
          layout.align = layoutNode.getAttribute("align");
          layout.alignV = layoutNode.getAttribute("alignV");
        }
        const description = item._attributes.description || "";
        const from = path.resolve(
          this.dir,
          item.from?.[0]._attributes.src || ""
        );
        const to =
          item.to?.map(item =>
            path.join(this.uiPath, item._attributes.src || "")
          ) || [];
        return { description, layout, from, to };
      }) || []
    );
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

export default class Template {
  // description.xml 路径
  private descFile = "";
  // description.xml 所在目录，即模板根目录
  private rootDir = "";
  // 模板解析数据
  private xmlData!: TypeOriginTempConf;
  private uiVersion?: TypeUiVersionConf;
  constructor(descFile: string) {
    if (!descFile) {
      throw new Error(errCode[3005]);
    }
    this.descFile = descFile;
    this.rootDir = path.dirname(descFile);
  }

  setUiVersion(data: TypeUiVersionConf): void {
    this.uiVersion = data;
  }

  private async ensureXmlData(): Promise<TypeOriginTempConf> {
    if (!this.xmlData) {
      this.xmlData = await xml2jsonCompact<TypeOriginTempConf>(this.descFile);
    }
    return this.xmlData;
  }

  async getDescFile(): Promise<string> {
    return this.descFile;
  }
  async getRootDir(): Promise<string> {
    return this.rootDir;
  }
  // 模板名称
  async getName(): Promise<string> {
    const tempData = await this.ensureXmlData();
    return tempData.description?.[0]._attributes.name || "";
  }
  // 模板版本
  async getVersion(): Promise<string> {
    const tempData = await this.ensureXmlData();
    return tempData.description?.[0]._attributes.version || "";
  }
  // 模板预览图
  async getPreview(): Promise<string> {
    const tempData = await this.ensureXmlData();
    return tempData.preview?.[0]._attributes.src || "";
  }
  // 模板支持 ui 版本列表
  async getUiVersions(): Promise<TypeUiVersionConf[]> {
    const tempData = await this.ensureXmlData();
    const uiVersions: TypeUiVersionConf[] =
      tempData.uiVersion?.map(item => ({
        name: item._attributes.name || "",
        code: item._attributes.code || "",
        src: item._attributes.src || ""
      })) || [];
    return uiVersions;
  }
  async getPages(
    data: TypeOriginTempModulePageConf[]
  ): Promise<TypeTempPageConf[]> {
    if (!this.uiVersion?.src) {
      throw new Error(errCode[3004]);
    }
    const uiPath = this.uiVersion.src;
    // 这里是在选择模板版本后得到的目标模块目录
    const pagesQueue = data.map(item => {
      const pageNode = new XMLNode(item);
      const pathname = path.join(uiPath, pageNode.getAttribute("src"));
      const file = path.join(this.rootDir, pathname);
      const page = new Page({ file, pathname, uiPath });
      return page.getData();
    });
    return await Promise.all(pagesQueue);
  }
  async getPageGroup(
    data: TypeOriginTempPageGroupConf[]
  ): Promise<TypeTempPageGroupConf[]> {
    const groupsQueue: Promise<TypeTempPageGroupConf>[] = data.map(
      async item => {
        const groupNode = new XMLNode(item);
        return {
          name: groupNode.getAttribute("name"),
          pages: item.page ? await this.getPages(item.page) : []
        };
      }
    );
    return await Promise.all(groupsQueue);
  }
  async getModules(): Promise<TypeTempModuleConf[]> {
    const tempData = await this.ensureXmlData();
    const modulesQueue: Promise<TypeTempModuleConf>[] =
      tempData.module?.map(async item => {
        const moduleNode = new XMLNode(item);
        const result: TypeTempModuleConf = {
          name: moduleNode.getAttribute("name"),
          icon: moduleNode.getAttribute("icon"),
          groups: item.group ? await this.getPageGroup(item.group) : []
        };
        return result;
      }) || [];
    return await Promise.all(modulesQueue);
  }
  async getTempInfo(): Promise<TypeTemplateInfo> {
    const templateInfo = new TemplateInfo();
    templateInfo.setName(await this.getName());
    templateInfo.setVersion(await this.getVersion());
    templateInfo.setPreview(await this.getPreview());
    templateInfo.setUiVersions(await this.getUiVersions());
    templateInfo.setModules(await this.getModules());
    return templateInfo.getData();
  }
}
