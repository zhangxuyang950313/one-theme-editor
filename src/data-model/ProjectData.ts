import { AbstractDataModel } from "../types/data-model";
import { TypeProjectDataDoc, TypeProjectInfo } from "../types/project";
import { BrandInfo } from "./BrandConfig";
import { UiVersion } from "./SourceConfig";

export class ProjectInfo extends AbstractDataModel<TypeProjectInfo> {
  data = {};

  static default(): TypeProjectInfo {
    return new ProjectInfo().default();
  }
}

export class ProjectData extends AbstractDataModel<TypeProjectDataDoc> {
  data = {
    uuid: "",
    brandInfo: BrandInfo.default(),
    projectPathname: "",
    projectInfo: ProjectInfo.default(),
    uiVersion: UiVersion.default(),
    sourceConfigUrl: "",
    _id: "",
    createdAt: new Date(),
    updatedAt: new Date()
  };

  static default(): TypeProjectDataDoc {
    return new ProjectData().default();
  }
}
