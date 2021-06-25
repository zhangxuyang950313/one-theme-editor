import { TypeBrandConf, TypeProjectDescription } from "types/project";
import { TypeTemplateData, TypeUiVersion } from "types/template";

export type TypeCreateProject = {
  brandInfo: TypeBrandConf;
  uiVersion: TypeUiVersion;
  description: TypeProjectDescription;
  templateConf: TypeTemplateData;
};

// 主题操作对象

export default class Project {}
