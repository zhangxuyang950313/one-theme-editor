import { TypeTemplateInfo } from "types/template";
import {
  TypeBrandInfo,
  TypeProjectData,
  TypeProjectDescription,
  TypeUiVersionInfo,
  TypeImageData,
  TypeImageMapper
} from "types/project";

export default class ProjectData {
  private uuid = "";
  private brand: TypeBrandInfo | null = null;
  private description: TypeProjectDescription | null = null;
  private uiVersion: TypeUiVersionInfo | null = null;
  private template: TypeTemplateInfo | null = null;
  private imageDataList: TypeImageData[] = [];
  private imageMapperList: TypeImageMapper[] = [];

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
  setUiVersion(data: TypeUiVersionInfo): void {
    this.uiVersion = data;
  }
  getUiVersion(): TypeUiVersionInfo | null {
    return this.uiVersion;
  }

  // 模板信息
  setTemplate(data: TypeTemplateInfo): void {
    this.template = data;
  }
  getTemplate(): TypeTemplateInfo | null {
    return this.template;
  }

  getData(): TypeProjectData {
    if (!this.description) throw new Error("主题信息为空");
    if (!this.brand) throw new Error("机型信息为空");
    if (!this.uiVersion) throw new Error("UI版本为空");
    if (!this.template) throw new Error("模板信息为空");
    const data: TypeProjectData = {
      uuid: this.uuid,
      brand: this.brand,
      description: this.description,
      uiVersion: this.uiVersion,
      template: this.template,
      imageDataList: this.imageDataList,
      imageMapperList: this.imageMapperList
    };
    return data;
  }
}
