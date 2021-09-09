import { TypeProjectDataDoc, TypeProjectInfo } from "src/types/project";
import { AbstractDataModel } from "./AbstractDataModel";
import { UiVersion } from "./SourceConfig";
import BrandConfig from "./BrandConfig";

export class ProjectInfo extends AbstractDataModel<TypeProjectInfo> {
  protected data: TypeProjectInfo = {};

  static default = new ProjectInfo().create();
}

export class ProjectData extends AbstractDataModel<TypeProjectDataDoc> {
  protected data: TypeProjectDataDoc = {
    uuid: "",
    brandConfig: new BrandConfig().create(),
    projectRoot: "",
    projectInfo: ProjectInfo.default,
    uiVersion: UiVersion.default,
    sourceConfigPath: "",
    _id: "",
    createdAt: new Date(),
    updatedAt: new Date()
  };

  static default = new ProjectData().create();
}
