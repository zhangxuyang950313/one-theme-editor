import { ProjectInfo } from "src/data/ProjectData";
import { TypeProjectInfo } from "src/types/project";
import { TypeFileTemplateConf } from "src/types/source";
import XmlFileCompiler from "./XmlFileCompiler";
import XmlTemplate from "./XmlTemplate";

// TODO: 解析 description.xml 文件为 TypeProjectInfo
export default class CompileProjectInfo extends XmlTemplate {
  static from(file: string): CompileProjectInfo {
    const element = new XmlFileCompiler(file).getElement();
    return new CompileProjectInfo(element);
  }

  getData(projectInfoConfig: TypeFileTemplateConf): TypeProjectInfo {
    const projectInfo = new ProjectInfo();
    projectInfoConfig.items.forEach(item => {
      // const value = super.
      // projectInfo.set(item.prop)
    });
    return projectInfo.create();
  }
}
