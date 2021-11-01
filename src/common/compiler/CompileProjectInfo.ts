import { ProjectInfo } from "src/data/ProjectData";
import { TypeProjectInfo } from "src/types/project";
import { TypeFileTempConfig } from "src/types/scenario.config";
import XmlFileCompiler from "./XmlFileCompiler";
import XmlCompilerExtra from "./XmlCompilerExtra";

// TODO: 解析 description.xml 文件为 TypeProjectInfo
export default class CompileProjectInfo extends XmlCompilerExtra {
  static from(file: string): CompileProjectInfo {
    const element = new XmlFileCompiler(file).getElement();
    return new CompileProjectInfo(element);
  }

  getData(projectInfoConfig: TypeFileTempConfig): TypeProjectInfo {
    const projectInfo = new ProjectInfo();
    projectInfoConfig.items.forEach(item => {
      // const value = super.
      // projectInfo.set(item.prop)
    });
    return projectInfo.create();
  }
}
