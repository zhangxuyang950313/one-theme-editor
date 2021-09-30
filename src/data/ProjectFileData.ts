import { PROJECT_FILE_TYPE } from "src/enum/index";
import {
  TypeProjectImageFileData,
  TypeProjectUnknownFileData,
  TypeProjectXmlFileData
} from "src/types/project";
import { AbstractDataModel } from "./AbstractDataModel";
import ImageData from "./ImageData";

export class ProjectFileImageData extends AbstractDataModel<TypeProjectImageFileData> {
  protected data: TypeProjectImageFileData = {
    type: PROJECT_FILE_TYPE.IMAGE,
    src: "",
    url: "",
    imageData: ImageData.default
  };
}

export class ProjectFileXmlData extends AbstractDataModel<TypeProjectXmlFileData> {
  protected data: TypeProjectXmlFileData = {
    type: PROJECT_FILE_TYPE.XML,
    src: "",
    element: {}
  };
}

export class ProjectFileUnknown extends AbstractDataModel<TypeProjectUnknownFileData> {
  protected data: TypeProjectUnknownFileData = {
    type: PROJECT_FILE_TYPE.UNKNOWN,
    src: ""
  };
  static default = new ProjectFileUnknown().create();
}
