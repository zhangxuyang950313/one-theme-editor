import { TypeTemplateInfo, TypeTempModuleConf } from "../types/project";
import TemplateInfo from "./TemplateInfo";
/**
 * 模板的配置数据
 * 用于映射模板素材，这时已经获得了模板版本数据，可以生成模块的映射数据
 * 编辑器中素材映射的核心数据
 */
export default class TemplateConf extends TemplateInfo {
  private modules: TypeTempModuleConf[];

  setModules(modules: TypeTempModuleConf[]): void {
    this.modules = modules;
  }
  getModules(): TypeTempModuleConf[] {
    return this.modules;
  }
  getData(): TypeTemplateInfo {
    return {
      ...super.getData(),
      modules: this.modules
    };
  }
}
