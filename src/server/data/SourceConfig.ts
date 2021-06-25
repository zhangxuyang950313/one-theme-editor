import path from "path";

import { getFileMD5, getImageData } from "common/utils";

import {
  TypeSourcePageGroupConf,
  TypeSourceConfig,
  TypeSourceModuleConf,
  TypeSourcePageConf,
  TypeUiVersion
} from "types/sourceConfig";
import { TypeImageInfo } from "types/project";
import {
  TypeOriginTempConf,
  TypeOriginTempPageGroupConf,
  TypeOriginTempModulePageConf
} from "types/xml-result";

import Page from "@/data/Page";
import XMLNode from "@/core/XMLNode";
import { xml2jsonCompact } from "@/compiler/xmlCompiler";

import ERR_CODE from "renderer/core/error-code";

export default class SourceConfig {
  // description.xml 路径
  private descFile = "";
  // description.xml 所在目录，即模板根目录
  private rootDir = "";
  // 模板解析数据
  private xmlData!: TypeOriginTempConf;
  private uiVersion?: TypeUiVersion;
  constructor(descFile: string, uiVersionConf?: TypeUiVersion) {
    if (!descFile) throw new Error(ERR_CODE[3005]);

    this.descFile = descFile;
    this.rootDir = path.dirname(descFile);
    this.uiVersion = uiVersionConf;
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
  private resolvePath(relativePath: string): string {
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
  async getPreview(): Promise<TypeImageInfo> {
    const tempData = await this.ensureXmlData();
    const src = path.join(
      this.rootDir,
      // TODO: 默认预览图
      tempData.preview?.[0]._attributes.src || ""
    );
    const {
      md5,
      width,
      height,
      size,
      filename,
      ninePatch
    } = await getImageData(src);
    return { md5, width, height, size, filename, ninePatch };
  }

  // 模板信息
  async getUiVersion(): Promise<TypeUiVersion> {
    const tempData = await this.ensureXmlData();
    const { name = "", code = "" } = tempData?.uiVersion?.[0]._attributes || {};
    const uiVersions: TypeUiVersion = { name, code };
    return uiVersions;
  }

  // 页面数据
  private async getPages(
    data: TypeOriginTempModulePageConf[]
  ): Promise<TypeSourcePageConf[]> {
    // 这里是在选择模板版本后得到的目标模块目录
    const pagesQueue = data.map(item => {
      const pageNode = new XMLNode(item);
      const pathname = path.join(this.rootDir, pageNode.getAttribute("src"));
      const file = path.join(this.rootDir, pathname);
      const page = new Page({ file, pathname });
      return page.getData();
    });
    return await Promise.all(pagesQueue);
  }

  // 页面分组数据
  private async getPageGroup(
    data: TypeOriginTempPageGroupConf[]
  ): Promise<TypeSourcePageGroupConf[]> {
    const groupsQueue: Promise<TypeSourcePageGroupConf>[] = data.map(
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
  async getModules(): Promise<TypeSourceModuleConf[]> {
    const tempData = await this.ensureXmlData();
    const modulesQueue: Promise<TypeSourceModuleConf>[] =
      tempData.module?.map(async (item, index) => {
        const moduleNode = new XMLNode(item);
        const iconSrc = path.join(
          this.rootDir,
          moduleNode.getAttribute("icon")
        );
        const md5 = await getFileMD5(iconSrc);
        const result: TypeSourceModuleConf = {
          index,
          name: moduleNode.getAttribute("name"),
          icon: md5,
          groups: item.group ? await this.getPageGroup(item.group) : []
        };
        return result;
      }) || [];
    return await Promise.all(modulesQueue);
  }

  async getData(): Promise<TypeSourceConfig> {
    return {
      name: await this.getName(),
      version: await this.getVersion(),
      preview: await this.getPreview(),
      uiVersion: await this.getUiVersion(),
      modules: await this.getModules()
    };
  }
}
