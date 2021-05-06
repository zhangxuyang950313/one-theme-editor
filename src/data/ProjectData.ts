import {
  TypeBrandInfo,
  TypeProjectData,
  TypeProjectInfo,
  TypeUiVersionInfo,
  TypeTemplateInfo
} from "../types/project.d";

export default class ProjectData {
  private projectInfo?: TypeProjectInfo;
  private brandInfo?: TypeBrandInfo;
  private uiVersionInfo?: TypeUiVersionInfo;
  private templateInfo?: TypeTemplateInfo;
  setProjectInfo(data: TypeProjectInfo): void {
    this.projectInfo = data;
  }
  getProjectInfo(): TypeProjectInfo | undefined {
    return this.projectInfo;
  }
  setBrandInfo(data: TypeBrandInfo): void {
    this.brandInfo = data;
  }
  getBrandInfo(): TypeBrandInfo | undefined {
    return this.brandInfo;
  }
  setUiVersionInfo(data: TypeUiVersionInfo): void {
    this.uiVersionInfo = data;
  }
  getUiVersion(): TypeUiVersionInfo | undefined {
    return this.uiVersionInfo;
  }
  setTemplateInfo(data: TypeTemplateInfo): void {
    this.templateInfo = data;
  }
  getTemplateInfo(): TypeTemplateInfo | undefined {
    return this.templateInfo;
  }
  getData(): TypeProjectData {
    if (!this.projectInfo) throw new Error("主题信息为空");
    if (!this.brandInfo) throw new Error("机型信息为空");
    if (!this.uiVersionInfo) throw new Error("UI版本为空");
    if (!this.templateInfo) throw new Error("模板信息为空");
    return {
      brandInfo: this.brandInfo,
      projectInfo: this.projectInfo,
      uiVersionInfo: this.uiVersionInfo,
      templateInfo: this.templateInfo
    };
  }
}
