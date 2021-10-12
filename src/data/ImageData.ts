import { TypeImageData } from "src/types/project";
import { AbstractDataModel } from "./AbstractDataModel";

export default class ImageData extends AbstractDataModel<TypeImageData> {
  protected data: TypeImageData = {
    mimeType: "",
    width: 0,
    height: 0,
    size: 0,
    filename: "",
    ninePatch: false
  };
  static get default(): TypeImageData {
    return new ImageData().create();
  }
}
