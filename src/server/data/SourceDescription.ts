import path from "path";
import fse from "fs-extra";
import { v4 as UUID } from "uuid";
import { TypeImagePathLike } from "types/index";
import { TypeXMLSourceConf } from "types/xml-result";
import { TypeUiVersion } from "types/project";
import { TypeSourceDescription } from "types/source-config";
import { SOURCE_CONFIG_DIR } from "server/core/path-config";
import { xml2jsonCompact } from "@/compiler/xml";
import XMLNode from "@/core/XMLNode";
import ERR_CODE from "renderer/core/error-code";

// 解析 sourceConfig 所有数据
export default class SourceDescription {
  private rootDir = SOURCE_CONFIG_DIR;
  private descFile = "";
  private namespace = "";
  // 模板解析数据
  private xmlData!: TypeXMLSourceConf;
  static filename = "description.xml";
  constructor(namespace: string, filename = SourceDescription.filename) {
    const descFile = path.join(this.getRootDir(), namespace, filename);
    if (!fse.existsSync(descFile)) throw new Error(ERR_CODE[3005]);
    this.namespace = namespace;
    this.descFile = descFile;
  }

  protected async ensureXmlData(): Promise<TypeXMLSourceConf> {
    if (!this.xmlData) {
      this.xmlData = await xml2jsonCompact<TypeXMLSourceConf>(this.descFile);
    }
    return this.xmlData;
  }

  getRootDir(): string {
    return this.rootDir;
  }

  getNamespace(): string {
    return this.namespace;
  }

  getDescFile(): string {
    return this.descFile;
  }

  // 处理成模板根目录
  private resolvePath(relativePath: string): string {
    return path.join(this.namespace, relativePath);
  }

  // 模板名称
  async getName(): Promise<string> {
    const xmlData = await this.ensureXmlData();
    return new XMLNode(xmlData)
      .getFirstChildOf("description")
      .getAttribute("name");
  }

  // 模板版本
  async getVersion(): Promise<string> {
    const xmlData = await this.ensureXmlData();
    return new XMLNode(xmlData)
      .getFirstChildOf("description")
      .getAttribute("version");
  }

  // 模板预览图
  async getPreview(): Promise<TypeImagePathLike> {
    const xmlData = await this.ensureXmlData();
    // TODO: 默认预览图
    return new XMLNode(xmlData).getFirstChildOf("preview").getAttribute("src");
  }

  // 模板信息
  async getUiVersion(): Promise<TypeUiVersion> {
    const xmlData = await this.ensureXmlData();
    const { name = "", code = "" } = xmlData?.uiVersion?.[0]._attributes || {};
    return { name, code };
  }

  /**
   * 解析配置配置的简短信息
   * 只解析 description.xml 不需要全部解析
   */
  async getDescription(): Promise<TypeSourceDescription> {
    return {
      key: UUID(),
      namespace: this.getNamespace(),
      name: await this.getName(),
      version: await this.getVersion(),
      preview: await this.getPreview(),
      uiVersion: await this.getUiVersion()
    };
  }
}
