import { TypeSourceConfig, TypeUiVersion } from "types/sourceConfig";
import {
  TypeBrandInfo,
  TypeProjectData,
  TypeProjectDescription,
  TypeImageMapper,
  TypeXmlMapper
} from "types/project";

export default class ProjectData {
  private uuid = "";
  private brand: TypeBrandInfo | null = null;
  private description: TypeProjectDescription | null = null;
  private uiVersion: TypeUiVersion | null = null;
  private template: TypeSourceConfig | null = null;
  private xmlMapperList: TypeXmlMapper[] = [];
  private imageMapperList: TypeImageMapper[] = [];
  private localPath: string | null = null;

  setUuid(uuid: string): void {
    this.uuid = uuid;
  }
  getUuid(): string {
    return this.uuid;
  }

  // 厂商信息
  setBrand(data: TypeBrandInfo): void {
    this.brand = data;
  }
  getBrand(): TypeBrandInfo | null {
    return this.brand;
  }

  // 工程信息
  setDescription(data: TypeProjectDescription): void {
    this.description = data;
  }
  getProjectInfo(): TypeProjectDescription | null {
    return this.description;
  }

  // UI版本
  setUiVersion(data: TypeUiVersion): void {
    this.uiVersion = data;
  }
  getUiVersion(): TypeUiVersion | null {
    return this.uiVersion;
  }

  // 模板信息
  setTemplate(data: TypeSourceConfig): void {
    this.template = data;
  }
  getTemplate(): TypeSourceConfig | null {
    return this.template;
  }

  // 本地路径
  setLocalPath(p?: string): void {
    if (!p) return;
    this.localPath = p;
  }
  getLocalPath(): string | null {
    return this.localPath;
  }

  getData(): TypeProjectData {
    if (!this.description) throw new Error("主题信息为空");
    if (!this.brand) throw new Error("机型信息为空");
    if (!this.uiVersion) throw new Error("UI版本为空");
    if (!this.template) throw new Error("模板信息为空");
    if (!this.localPath) throw new Error("本地路径为空");
    const data: TypeProjectData = {
      uuid: this.uuid,
      brand: this.brand,
      description: this.description,
      uiVersion: this.uiVersion,
      template: this.template,
      imageMapperList: this.imageMapperList,
      xmlMapperList: this.xmlMapperList,
      localPath: this.localPath
    };
    return data;
  }
}
