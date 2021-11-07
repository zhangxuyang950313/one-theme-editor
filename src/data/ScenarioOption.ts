// 场景选项

import { TypeScenarioOption } from "src/types/scenario.config";
import { AbstractDataModel } from "./AbstractDataModel";
import ScenarioConfig from "./ScenarioConfig";

export default class ScenarioOption extends AbstractDataModel<TypeScenarioOption> {
  protected data: TypeScenarioOption = {
    src: "",
    ...ScenarioConfig.default
  };
  static get default(): TypeScenarioOption {
    return new ScenarioOption().create();
  }
}
