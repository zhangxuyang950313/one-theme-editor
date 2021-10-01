import { PROJECT_FILE_TYPE } from "src/enum/index";
import {
  TypeImageFileData,
  TypeUnknownFileData,
  TypeXmlFileData
} from "src/types/project";
import { AbstractDataModel } from "./AbstractDataModel";
import ImageData from "./ImageData";

export class ProjectFileImageData extends AbstractDataModel<TypeImageFileData> {
  protected data: TypeImageFileData = {
    type: PROJECT_FILE_TYPE.IMAGE,
    src: "",
    url: "",
    imageData: ImageData.default
  };
}

export class ProjectFileXmlData extends AbstractDataModel<TypeXmlFileData> {
  protected data: TypeXmlFileData = {
    type: PROJECT_FILE_TYPE.XML,
    src: "",
    element: {}
  };
}

export class ProjectFileUnknown extends AbstractDataModel<TypeUnknownFileData> {
  protected data: TypeUnknownFileData = {
    type: PROJECT_FILE_TYPE.UNKNOWN,
    src: ""
  };
  static default = new ProjectFileUnknown().create();
}
