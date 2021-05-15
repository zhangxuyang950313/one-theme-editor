import {
  TypeBrandConf,
  TypeProjectDesc,
  TypeTemplateInfo,
  TypeUiVersionConf
} from "types/project";

export type TypeCreateProject = {
  brandInfo: TypeBrandConf;
  uiVersion: TypeUiVersionConf;
  projectInfo: TypeProjectDesc;
  templateConf: TypeTemplateInfo;
};

// 主题操作对象

export default class Project {}
