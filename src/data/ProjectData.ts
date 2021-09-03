import { TypeProjectDataDoc, TypeProjectInfo } from "src/types/project";
import { AbstractDataModel } from "./AbstractDataModel";
import { BrandOption } from "./BrandConfig";
import { UiVersion } from "./SourceConfig";

export class ProjectInfo extends AbstractDataModel<TypeProjectInfo> {
  protected data: TypeProjectInfo = {};

  static default(): TypeProjectInfo {
    return new ProjectInfo().default();
  }
}

export class ProjectData extends AbstractDataModel<TypeProjectDataDoc> {
  protected data: TypeProjectDataDoc = {
    uuid: "",
    brandOption: new BrandOption().create(),
    projectRoot: "",
    projectInfo: ProjectInfo.default(),
    uiVersion: UiVersion.default(),
    sourceConfigPath: "",
    _id: "",
    createdAt: new Date(),
    updatedAt: new Date()
  };

  static default(): TypeProjectDataDoc {
    return new ProjectData().default();
  }
}
