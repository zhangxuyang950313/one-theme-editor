import { TypeProjectDataDoc, TypeProjectInfo } from "src/types/project";
import { AbstractDataModel } from "./AbstractDataModel";
import { UiVersion } from "./ResourceConfig";

export class ProjectInfo extends AbstractDataModel<TypeProjectInfo> {
  protected data: TypeProjectInfo = {};

  static default = new ProjectInfo().create();
}

export default class ProjectData extends AbstractDataModel<TypeProjectDataDoc> {
  protected data: TypeProjectDataDoc = {
    uuid: "",
    root: "",
    description: ProjectInfo.default,
    uiVersion: UiVersion.default,
    scenarioMd5: "",
    scenarioSrc: "",
    resourceSrc: "",
    _id: "",
    createdAt: new Date(),
    updatedAt: new Date()
  };

  static default = new ProjectData().create();
}
