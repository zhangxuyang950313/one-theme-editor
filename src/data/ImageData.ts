import { TypeImageData } from "../types/project";
import { AbstractDataModel } from "./AbstractDataModel";

export default class ImageData extends AbstractDataModel<TypeImageData> {
  protected data: TypeImageData = {
    width: 0,
    height: 0,
    size: 0,
    filename: "",
    ninePatch: false
  };
}
