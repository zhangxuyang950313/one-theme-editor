import { ProjectInfo } from "src/data/ProjectData";

import XmlCompiler from "./XmlCompiler";

import XmlCompilerExtra from "./XmlCompilerExtra";

import type { TypeProjectInfo } from "src/types/project";
import type { TypeFileTempConfig } from "src/types/config.scenario";

// TODO: 解析 description.xml 文件为 TypeProjectInfo
export default class CompileProjectInfo extends XmlCompilerExtra {
  static from(file: string): CompileProjectInfo {
    const element = new XmlCompiler(file).getElement();
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
