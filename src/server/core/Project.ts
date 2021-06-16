import { TypeBrandConf, TypeProjectDescription } from "types/project";
import { TypeTemplateInfo, TypeUiVersionConf } from "types/template";

export type TypeCreateProject = {
  brandInfo: TypeBrandConf;
  uiVersion: TypeUiVersionConf;
  description: TypeProjectDescription;
  templateConf: TypeTemplateInfo;
};

// 主题操作对象

export default class Project {}
