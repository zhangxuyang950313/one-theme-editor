import { TypeServerConfig } from "src/types/extraConfig";
import { AbstractDataModel } from "./AbstractDataModel";

export default class ServerConfig extends AbstractDataModel<TypeServerConfig> {
  protected data: TypeServerConfig = {
    host: "localhost",
    port: 0
  };
  static default = new ServerConfig().create();
}
