import { FILE_TYPE } from "src/enum/index";
import {
  TypeImageFileData,
  TypeUnknownFileData,
  TypeXmlFileData
} from "src/types/project";
import { AbstractDataModel } from "./AbstractDataModel";
import ImageData from "./ImageData";

export class ImageFileData extends AbstractDataModel<TypeImageFileData> {
  protected data: TypeImageFileData = {
    type: FILE_TYPE.IMAGE,
    src: "",
    url: "",
    data: ImageData.default
  };
  static get default(): TypeImageFileData {
    return new ImageFileData().create();
  }
}

export class XmlFileData extends AbstractDataModel<TypeXmlFileData> {
  protected data: TypeXmlFileData = {
    type: FILE_TYPE.XML,
    src: "",
    data: {}
  };
  static get default(): TypeXmlFileData {
    return new XmlFileData().create();
  }
}

export class UnknownFileData extends AbstractDataModel<TypeUnknownFileData> {
  protected data: TypeUnknownFileData = {
    type: FILE_TYPE.UNKNOWN,
    src: "",
    data: null
  };
  static get default(): TypeUnknownFileData {
    return new UnknownFileData().create();
  }
}
