import path from "path";
import { v4 as UUID } from "uuid";
import { xml2jsonCompact } from "@/compiler/xml";
import { TypeSourceDescription, TypeUiVersion } from "types/source-config";
import { TypeOriginTempConf } from "types/xml-result";
import { TypeImagePathLike } from "types/index";
import ERR_CODE from "renderer/core/error-code";

// 解析 sourceConfig 所有数据
export default class SourceDescription {
  // description.xml 路径
  private descFile = "";
  // description.xml 所在目录，即模板根目录
  private rootDir = "";
  // 模板解析数据
  private xmlData!: TypeOriginTempConf;
  constructor(descFile: string) {
    if (!descFile) throw new Error(ERR_CODE[3005]);

    this.descFile = descFile;
    this.rootDir = path.dirname(descFile);
  }

  protected async ensureXmlData(): Promise<TypeOriginTempConf> {
    if (!this.xmlData) {
      this.xmlData = await xml2jsonCompact<TypeOriginTempConf>(this.descFile);
    }
    return this.xmlData;
  }

  getDescFile(): string {
    return this.descFile;
  }

  getRootDir(): string {
    return this.rootDir;
  }

  // 处理成模板根目录
  private resolvePath(relativePath: string): string {
    return path.join(this.rootDir, relativePath);
  }

  // 模板名称
  async getName(): Promise<string> {
    const tempData = await this.ensureXmlData();
    return tempData.description?.[0]._attributes.name || "";
  }

  // 模板版本
  async getVersion(): Promise<string> {
    const tempData = await this.ensureXmlData();
    return tempData.description?.[0]._attributes.version || "";
  }

  // 模板预览图
  async getPreview(): Promise<TypeImagePathLike> {
    const tempData = await this.ensureXmlData();
    // TODO: 默认预览图
    return tempData.preview?.[0]._attributes.src || "";
  }

  // 模板信息
  async getUiVersion(): Promise<TypeUiVersion> {
    const confData = await this.ensureXmlData();
    const { name = "", code = "" } = confData?.uiVersion?.[0]._attributes || {};
    return { name, code };
  }

  /**
   * 解析配置配置的简短信息
   * 只解析 description.xml 不需要全部解析
   */
  async getDescription(): Promise<TypeSourceDescription> {
    return {
      key: UUID(),
      file: this.getDescFile(),
      root: this.getRootDir(),
      name: await this.getName(),
      version: await this.getVersion(),
      preview: await this.getPreview(),
      uiVersion: await this.getUiVersion()
    };
  }
}
