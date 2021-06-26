import * as PATHS from "server/core/path-config";
import ACTION_TYPES from "@/store/actions";

type TypeActionSetServerPort = {
  type: typeof ACTION_TYPES.SET_SERVER_PORT;
  payload: string | number;
};

type TypeActionSetPathConfig = {
  type: typeof ACTION_TYPES.SET_PATH_CONFIG;
  payload: typeof PATHS;
};

export type TypeActions = TypeActionSetServerPort | TypeActionSetPathConfig;

// 设置本次服务端口
export function ActionSetServerPort(
  port: string | number
): TypeActionSetServerPort {
  return { type: ACTION_TYPES.SET_SERVER_PORT, payload: port };
}

// 设置编辑器路径配置
export function ActionSetPathConfig(
  payload: typeof PATHS
): TypeActionSetPathConfig {
  return { type: ACTION_TYPES.SET_PATH_CONFIG, payload };
}
