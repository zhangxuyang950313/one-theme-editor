// 场景选项

import { AbstractDataModel } from "./AbstractDataModel";
import ScenarioConfig from "./ScenarioConfig";

import type { TypeScenarioOption } from "src/types/config.scenario";

export default class ScenarioOption extends AbstractDataModel<TypeScenarioOption> {
  protected data: TypeScenarioOption = {
    src: "",
    ...ScenarioConfig.default
  };
  static get default(): TypeScenarioOption {
    return new ScenarioOption().create();
  }
}
