import { TypeTemplateConf, TypeUiVersionConf } from "../types/project.d";

/**
 * 模板的预览信息
 * 用于选择模板时的必要信息，由于此时的模板版本还未知，故不能生成模板映射数据
 */
export default class TemplateConf {
  private key = "";
  private root = "";
  private name = "";
  private version = "";
  private cover = "";
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
  setCover(cover: string): void {
    this.cover = cover;
  }
  getCover(): string {
    return this.cover;
  }
  setUiVersions(uiVersions: TypeUiVersionConf[]): void {
    this.uiVersions = uiVersions;
  }
  getUiVersions(): TypeUiVersionConf[] {
    return this.uiVersions;
  }
  getData(): TypeTemplateConf {
    return {
      key: this.key,
      name: this.name,
      version: this.version,
      cover: this.cover,
      uiVersions: this.uiVersions
    };
  }
}
