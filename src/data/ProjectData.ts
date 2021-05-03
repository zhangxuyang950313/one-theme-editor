import {
  TypeBrandInfo,
  TypeProjectData,
  TypeProjectInfo,
  TypeUiVersionInfo,
  TypeTemplateInfo
} from "../types/project.d";

export default class ProjectData {
  private projectInfo: TypeProjectInfo;
  private brandInfo: TypeBrandInfo;
  private uiVersionInfo: TypeUiVersionInfo;
  private templateInfo: TypeTemplateInfo;
  setProjectInfo(data: TypeProjectInfo): void {
    this.projectInfo = data;
  }
  getProjectInfo(): TypeProjectInfo {
    return this.projectInfo;
  }
  setBrandInfo(data: TypeBrandInfo): void {
    this.brandInfo = data;
  }
  getBrandInfo(): TypeBrandInfo {
    return this.brandInfo;
  }
  setUiVersionInfo(data: TypeUiVersionInfo): void {
    this.uiVersionInfo = data;
  }
  getUiVersion(): TypeUiVersionInfo {
    return this.uiVersionInfo;
  }
  setTemplateInfo(data: TypeTemplateInfo): void {
    this.templateInfo = data;
  }
  getTemplateInfo(): TypeTemplateInfo {
    return this.templateInfo;
  }
  getData(): TypeProjectData {
    return {
      projectInfo: this.projectInfo,
      brandInfo: this.brandInfo,
      uiVersionInfo: this.uiVersionInfo,
      templateInfo: this.templateInfo
    };
  }
}
