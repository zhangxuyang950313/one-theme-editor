import path from "path";
import errCode from "renderer/core/error-code";
import {
  TypeTempPageGroupConf,
  TypeTemplateInfo,
  TypeTempModuleConf,
  TypeTempPageConf,
  TypeUiVersionConf
} from "types/project";
import {
  TypeOriginTempConf,
  TypeOriginTempPageGroupConf,
  TypeOriginTempModulePageConf
} from "types/xml-result";
import TemplateInfo from "src/data/TemplateInfo";
import { getImageUrlByAbsPath } from "@/db-handler/image";
import { xml2jsonCompact } from "./xmlCompiler";
import XMLNode from "./XMLNode";
import Page from "./Page";

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

  getDescFile(): string {
    return this.descFile;
  }

  getRootDir(): string {
    return this.rootDir;
  }

  // 处理成模板根目录
  resolvePath(relativePath: string): string {
    return path.join(this.getRootDir(), relativePath);
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
    const imageSrc = path.join(
      this.rootDir,
      tempData.preview?.[0]._attributes.src || ""
    );
    return getImageUrlByAbsPath(imageSrc);
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

  // 页面数据
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

  // 页面分组数据
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

  // 模块数据
  async getModules(): Promise<TypeTempModuleConf[]> {
    const tempData = await this.ensureXmlData();
    const modulesQueue: Promise<TypeTempModuleConf>[] =
      tempData.module?.map(async (item, index) => {
        const moduleNode = new XMLNode(item);
        const iconSrc = path.join(
          this.rootDir,
          moduleNode.getAttribute("icon")
        );
        const iconUrl = await getImageUrlByAbsPath(iconSrc);
        const result: TypeTempModuleConf = {
          index,
          name: moduleNode.getAttribute("name"),
          icon: iconUrl,
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
