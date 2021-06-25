import path from "path";
import { v4 as getUUID } from "uuid";
import { TypeSourceDescription } from "types/source-config";
import SourceConfig from "@/data/SourceConfig";
import ERR_CODE from "src//renderer/core/error-code";

/**
 * 解析配置配置的简短信息
 * 只解析 description.xml 不需要全部解析
 * @param descFile description.xml 路径
 * @returns
 */
export default class SourceDescription {
  private root?: string;
  private file?: string;
  private sourceConfig: SourceConfig;
  constructor(descFile: string) {
    this.file = descFile;
    this.root = path.dirname(descFile);
    this.sourceConfig = new SourceConfig(descFile);
  }

  async getData(): Promise<TypeSourceDescription> {
    if (!this.file || !this.root) throw new Error(ERR_CODE[4005]);
    return {
      key: getUUID(),
      root: this.root,
      file: this.file,
      name: await this.sourceConfig.getName(),
      version: await this.sourceConfig.getVersion(),
      preview: await this.sourceConfig.getPreview(),
      uiVersion: await this.sourceConfig.getUiVersion()
    };
  }
}
