import { FILE_PROTOCOL } from "src/enum/index";
import {
  TypeImageFileData,
  TypeUnknownFileData,
  TypeXmlFileData
} from "src/types/project";
import { AbstractDataModel } from "./AbstractDataModel";
import ImageData from "./ImageData";

export class ProjectFileImageData extends AbstractDataModel<TypeImageFileData> {
  protected data: TypeImageFileData = {
    type: FILE_PROTOCOL.IMAGE,
    src: "",
    url: "",
    data: ImageData.default
  };
  static get default(): TypeImageFileData {
    return new ProjectFileImageData().create();
  }
}

export class ProjectFileXmlData extends AbstractDataModel<TypeXmlFileData> {
  protected data: TypeXmlFileData = {
    type: FILE_PROTOCOL.XML,
    src: "",
    data: {}
  };
  static get default(): TypeXmlFileData {
    return new ProjectFileXmlData().create();
  }
}

export class ProjectFileUnknown extends AbstractDataModel<TypeUnknownFileData> {
  protected data: TypeUnknownFileData = {
    type: FILE_PROTOCOL.UNKNOWN,
    src: ""
  };
  static get default(): TypeUnknownFileData {
    return new ProjectFileUnknown().create();
  }
}
