import { TypeImageInfo } from "types/project.d";
import { TypeSourceDescription, TypeUiVersion } from "types/sourceConfig";

// 素材配置的描述信息
export default class SourceDescription {
  private key = "";
  private root = "";
  private file = "";
  private name = "";
  private version = "";
  private preview!: TypeImageInfo;
  private uiVersion!: TypeUiVersion;

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
  getData(): TypeSourceDescription {
    return {
      key: this.getKey(),
      root: this.getRoot(),
      file: this.getFile(),
      name: this.getName(),
      version: this.getVersion(),
      preview: this.getPreview(),
      uiVersion: this.getUiVersion()
    };
  }
}
