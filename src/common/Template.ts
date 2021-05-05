import path from "path";
import errCode from "renderer/core/error-code";
import { xml2jsonCompact } from "common/xmlCompiler";
import {
  TypeTempClassConf,
  TypeTemplateInfo,
  TypeTempModuleConf,
  TypeTempPageConf,
  TypeTempPageConfigConf,
  TypeTempPageSourceConf,
  TypeUiVersionConf
} from "types/project";
import {
  TypeOriginTempConf,
  TypeOriginTempModuleClassConf,
  TypeOriginTempModuleClassPageConf,
  TypeTempLayout,
  TypeTempOriginPageConf
} from "types/xml-result";
import TemplateInfo from "src/data/TemplateInfo";
import XMLNode from "common/XMLNode";
import { TypeTempPageCategoryConf } from "./../types/project.d";

export class Page {
  private file: string;
  private xmlData!: TypeTempOriginPageConf;
  constructor(file: string) {
    this.file = file;
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
        return {
          description: item._attributes.description || "",
          layout,
          from: item.from?.[0]._attributes.src || "",
          to: item.to?.map(item => item._attributes.src) || []
        };
      }) || []
    );
  }

  async getColorList() {
    const xmlData = await this.ensureXmlData();
  }

  async getIntegerList() {
    const xmlData = await this.ensureXmlData();
  }

  async getBoolList() {
    const xmlData = await this.ensureXmlData();
  }

  async getDimenList() {
    const xmlData = await this.ensureXmlData();
  }

  async getData(): Promise<TypeTempPageConf> {
    const [config, cover, category, source, xml] = await Promise.all([
      this.getConfig(),
      this.getPreview(),
      this.getCategoryList(),
      this.getSourceList(),
      [] // todo
    ]);
    return { config, cover, category, source, xml };
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
  // 模板封面
  async getCover(): Promise<string> {
    const tempData = await this.ensureXmlData();
    return tempData.poster?.[0]._attributes.src || "";
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
    data: TypeOriginTempModuleClassPageConf[]
  ): Promise<TypeTempPageConf[]> {
    if (!this.uiVersion?.src) {
      throw new Error(errCode[3004]);
    }
    // 这里是在选择模板版本后得到的目标模块目录
    const moduleDir = path.resolve(this.rootDir, this.uiVersion.src);
    const pagesQueue = data.map(item => {
      const pageNode = new XMLNode(item);
      const pageFile = path.resolve(moduleDir, pageNode.getAttribute("src"));
      const page = new Page(pageFile);
      return page.getData();
    });
    return await Promise.all(pagesQueue);
  }
  async getClasses(
    data: TypeOriginTempModuleClassConf[]
  ): Promise<TypeTempClassConf[]> {
    const classesQueue: Promise<TypeTempClassConf>[] = data.map(async item => {
      const classNode = new XMLNode(item);
      return {
        name: classNode.getAttribute("name"),
        pages: item.page ? await this.getPages(item.page) : []
      };
    });
    return await Promise.all(classesQueue);
  }
  async getModules(): Promise<TypeTempModuleConf[]> {
    const tempData = await this.ensureXmlData();
    const modulesQueue: Promise<TypeTempModuleConf>[] =
      tempData.module?.map(async item => {
        const moduleNode = new XMLNode(item);
        return {
          name: moduleNode.getAttribute("name"),
          icon: moduleNode.getAttribute("icon"),
          classes: item.class ? await this.getClasses(item.class) : []
        };
      }) || [];
    return await Promise.all(modulesQueue);
  }
  async getTempInfo(): Promise<TypeTemplateInfo> {
    const data = await xml2jsonCompact<TypeOriginTempConf>(this.descFile);
    const templateInfo = new TemplateInfo();
    templateInfo.setCover(this.xmlData.poster?.[0]._attributes.src || "");
    templateInfo.setName(this.xmlData.description?.[0]._attributes.name || "");
    return templateInfo.getData();
  }
}

// import path from "path";
// import fse from "fs-extra";
// import _ from "lodash";
// import {
//   TypeBrandConf,
//   TypeTempPageConf,
//   TypeTemplateConf
// } from "../types/project";
// import {
//   TypeOriginTempConf,
//   TypeOriginBrandConf,
//   TypeTempOriginPageConf
// } from "../types/xml-result";
// import errCode from "../renderer/core/error-code";
// import { getTempDirByBrand, TEMPLATE_CONFIG } from "./paths";
// import { xml2jsonCompact } from "./xmlCompiler";
// import { getRandomStr } from "./utils";

// // 解析单个预览页面配置
// export async function compilePageConf(file: string): Promise<TypeTempPageConf> {
//   if (!fse.existsSync(file)) {
//     return Promise.reject(new Error(errCode[3000]));
//   }
//   const data = await xml2jsonCompact<TypeTempOriginPageConf>(file);
//   return {
//     root: path.dirname(file),
//     config: {
//       version: data.config?.[0]._attributes.version || "",
//       description: data.config?.[0]._attributes.description || "",
//       screenWidth: data.config?.[0]._attributes.screenWidth || ""
//     },
//     cover: data.cover?.[0]._attributes.src || "",
//     category:
//       data.category?.map(item => ({
//         tag: item._attributes.tag || "",
//         description: item._attributes.description || "",
//         type: item._attributes.type || null
//       })) || [],
//     source:
//       data.source?.map(item => ({
//         description: item._attributes.description || "",
//         layout: item.layout?.[0]._attributes || {},
//         from: item.from?.[0]._attributes.src || "",
//         to: item.to?.map(item => item._attributes.src) || []
//       })) || [],
//     xml: []
//   };
// }
