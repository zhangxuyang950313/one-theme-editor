import {
  TypeBrandInfo,
  TypeProjectData,
  TypeProjectDesc,
  TypeUiVersionInfo,
  TypeTemplateInfo
} from "../types/project.d";

export default class ProjectData {
  private projectInfo?: TypeProjectDesc;
  private brand?: TypeBrandInfo;
  private uiVersion?: TypeUiVersionInfo;
  private template?: TypeTemplateInfo;
  setProjectDesc(data: TypeProjectDesc): void {
    this.projectInfo = data;
  }
  getProjectDesc(): TypeProjectDesc | undefined {
    return this.projectInfo;
  }
  setBrand(data: TypeBrandInfo): void {
    this.brand = data;
  }
  getBrand(): TypeBrandInfo | undefined {
    return this.brand;
  }
  setUiVersion(data: TypeUiVersionInfo): void {
    this.uiVersion = data;
  }
  getUiVersion(): TypeUiVersionInfo | undefined {
    return this.uiVersion;
  }
  setTemplate(data: TypeTemplateInfo): void {
    this.template = data;
  }
  getTemplate(): TypeTemplateInfo | undefined {
    return this.template;
  }
  getData(): TypeProjectData {
    if (!this.projectInfo) throw new Error("主题信息为空");
    if (!this.brand) throw new Error("机型信息为空");
    if (!this.uiVersion) throw new Error("UI版本为空");
    if (!this.template) throw new Error("模板信息为空");
    const data: TypeProjectData = {
      brand: this.brand,
      projectInfo: this.projectInfo,
      uiVersion: this.uiVersion,
      template: this.template
    };
    return data;
  }
}
