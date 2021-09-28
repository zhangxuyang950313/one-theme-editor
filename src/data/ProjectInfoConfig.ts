import { TypeProjectInfoConf } from "src/types/source";
import { AbstractDataModel } from "./AbstractDataModel";

export class ProjectInfoConfig extends AbstractDataModel<TypeProjectInfoConf> {
  protected data: TypeProjectInfoConf = {
    output: "",
    propsMapper: [],
    template: ""
  };
}
