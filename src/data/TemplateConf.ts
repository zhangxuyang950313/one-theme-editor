import { TypeTemplateConf, TypeUiVersionConf } from "../types/project.d";

/**
 * 模板的预览信息
 * 用于选择模板时的必要信息，由于此时的模板版本还未知，故不能生成模板映射数据
 */
export default class TemplateConf {
  private key = "";
  private root = "";
  private file = "";
  private name = "";
  private version = "";
  private preview = "";
  private uiVersions: TypeUiVersionConf[] = [];

  setKey(key: string): void {
    this.key = key;
  }
  getKey(): string {
    return this.key;
  }
  setRoot(root: string): void {
    this.root = root;
  }
  getRoot(): string {
    return this.root;
  }
  setFile(file: string): void {
    this.file = file;
  }
  getFile(): string {
    return this.file;
  }
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
  getData(): TypeTemplateConf {
    return {
      key: this.getKey(),
      root: this.getRoot(),
      file: this.getFile(),
      name: this.getName(),
      version: this.getVersion(),
      preview: this.getPreview(),
      uiVersions: this.getUiVersions()
    };
  }
}
