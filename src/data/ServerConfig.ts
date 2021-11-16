import { TypeServerConfig } from "src/types/config.extra";

import { AbstractDataModel } from "./AbstractDataModel";

export default class ServerConfig extends AbstractDataModel<TypeServerConfig> {
  protected data: TypeServerConfig = {
    host: "localhost",
    port: 0
  };
  static get default(): TypeServerConfig {
    return new ServerConfig().create();
  }
}
