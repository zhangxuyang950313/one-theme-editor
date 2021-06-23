import ACTION_TYPES from "@/store/actions";

type TypeActionSetServerPort = {
  type: typeof ACTION_TYPES.SET_SERVER_PORT;
  payload: string | number;
};

export type TypeActions = TypeActionSetServerPort;

// 设置本次服务端口
export function ActionSetServerPort(
  port: string | number
): TypeActionSetServerPort {
  return { type: ACTION_TYPES.SET_SERVER_PORT, payload: port };
}
