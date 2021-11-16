import { TypeProjectDataDoc, TypeProjectInfo } from "src/types/project";

import { AbstractDataModel } from "./AbstractDataModel";
import { UiVersion } from "./ResourceConfig";

export class ProjectInfo extends AbstractDataModel<TypeProjectInfo> {
  protected data: TypeProjectInfo = {};

  static get default(): TypeProjectInfo {
    return new ProjectInfo().create();
  }
}

export default class ProjectData extends AbstractDataModel<TypeProjectDataDoc> {
  protected data: TypeProjectDataDoc = {
    uuid: "",
    root: "",
    description: ProjectInfo.default,
    uiVersion: UiVersion.default,
    scenarioSrc: "",
    resourceSrc: "",
    _id: "",
    createdAt: new Date(),
    updatedAt: new Date()
  };

  static get default(): TypeProjectDataDoc {
    return new ProjectData().create();
  }
}
