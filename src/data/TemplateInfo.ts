import {
  TypeTemplateInfo,
  TypeTempModuleConf,
  TypeUiVersionConf
} from "../types/project";

/**
 * 模板的配置数据
 * 用于映射模板素材，这时已经获得了模板版本数据，可以生成模块的映射数据
 * 编辑器中素材映射的核心数据
 */
export default class TemplateInfo {
  private name = "";
  private version = "";
  private preview = "";
  private uiVersions: TypeUiVersionConf[] = [];
  private modules: TypeTempModuleConf[] = [];

  setName(name: string): void {
    this.name = name;
  }
  getName(): string {
    return this.name;
  }
  setVersion(version: string): void {
    this.version = version;
  }
  getVersion(): string {
    return this.version;
  }
  setPreview(preview: string): void {
    this.preview = preview;
  }
  getPreview(): string {
    return this.preview;
  }
  setUiVersions(uiVersions: TypeUiVersionConf[]): void {
    this.uiVersions = uiVersions;
  }
  getUiVersions(): TypeUiVersionConf[] {
    return this.uiVersions;
  }
  setModules(modules: TypeTempModuleConf[]): void {
    this.modules = modules;
  }
  getModules(): TypeTempModuleConf[] {
    return this.modules;
  }
  getData(): TypeTemplateInfo {
    return {
      name: this.getName(),
      version: this.getVersion(),
      preview: this.getPreview(),
      uiVersions: this.getUiVersions(),
      modules: this.getModules()
    };
  }
}
