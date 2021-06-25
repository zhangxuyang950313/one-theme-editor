import { TypeImageInfo } from "types/project";
import {
  TypeTemplateData,
  TypeTempModuleConf,
  TypeUiVersion
} from "types/template";

/**
 * 模板的配置数据
 * 用于映射模板素材，这时已经获得了模板版本数据，可以生成模块的映射数据
 * 编辑器中素材映射的核心数据
 */
export default class TemplateInfo {
  private name = "";
  private version = "";
  private preview!: TypeImageInfo;
  private uiVersion!: TypeUiVersion;
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
  setPreview(preview: TypeImageInfo): void {
    this.preview = preview;
  }
  getPreview(): TypeImageInfo {
    return this.preview;
  }
  setUiVersion(uiVersion: TypeUiVersion): void {
    this.uiVersion = uiVersion;
  }
  getUiVersion(): TypeUiVersion {
    return this.uiVersion;
  }
  setModules(modules: TypeTempModuleConf[]): void {
    this.modules = modules;
  }
  getModules(): TypeTempModuleConf[] {
    return this.modules;
  }
  getData(): TypeTemplateData {
    return {
      name: this.getName(),
      version: this.getVersion(),
      preview: this.getPreview(),
      uiVersion: this.getUiVersion(),
      modules: this.getModules()
    };
  }
}
