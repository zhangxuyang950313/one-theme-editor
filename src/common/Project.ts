import {
  TypeBrandConf,
  TypeProjectInfo,
  TypeTemplateInfo,
  TypeUiVersionConf
} from "../types/project";

export type TypeCreateProject = {
  brandInfo: TypeBrandConf;
  uiVersion: TypeUiVersionConf;
  projectInfo: TypeProjectInfo;
  templateConf: TypeTemplateInfo;
};
