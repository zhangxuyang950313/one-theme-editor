import { PROJECT_FILE_TYPE } from "../enum";
import {
  TypeProjectFileImageData,
  TypeProjectFileXmlData
} from "../types/project";
import { AbstractDataModel } from "./AbstractDataModel";
import ImageData from "./ImageData";

export class ProjectFileImageData extends AbstractDataModel<TypeProjectFileImageData> {
  protected data: TypeProjectFileImageData = {
    type: PROJECT_FILE_TYPE.IMAGE,
    src: "",
    url: "",
    imageData: new ImageData().default()
  };
}

export class ProjectFileXmlData extends AbstractDataModel<TypeProjectFileXmlData> {
  protected data: TypeProjectFileXmlData = {
    type: PROJECT_FILE_TYPE.XML,
    src: "",
    element: {}
  };
}
