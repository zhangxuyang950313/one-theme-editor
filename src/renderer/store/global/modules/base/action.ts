import { TypePathConfig } from "src/types/extraConfig";
import ACTION_TYPES from "@/store/global/actionType";

type TypeActionSetServerPort = {
  type: typeof ACTION_TYPES.SET_SERVER_PORT;
  payload: string | number;
};

type TypeActionSetAppPath = {
  type: typeof ACTION_TYPES.SET_PATH_CONFIG;
  payload: TypePathConfig;
};

export type TypeActions = TypeActionSetServerPort | TypeActionSetAppPath;

// 设置本次服务端口
export function ActionSetServerPort(
  port: string | number
): TypeActionSetServerPort {
  return { type: ACTION_TYPES.SET_SERVER_PORT, payload: port };
}

// 设置编辑器路径配置
export function ActionSetAppConfig(
  payload: TypePathConfig
): TypeActionSetAppPath {
  return { type: ACTION_TYPES.SET_PATH_CONFIG, payload };
}
