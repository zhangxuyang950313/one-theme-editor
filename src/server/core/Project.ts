import { TypeBrandConf, TypeProjectDesc } from "types/project";
import { TypeTemplateInfo, TypeUiVersionConf } from "types/template";

export type TypeCreateProject = {
  brandInfo: TypeBrandConf;
  uiVersion: TypeUiVersionConf;
  projectInfo: TypeProjectDesc;
  templateConf: TypeTemplateInfo;
};

// 主题操作对象

export default class Project {}
