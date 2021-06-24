import io from "socket.io-client";
import { HOST, PORT } from "common/config";
import SOCKET_EVENT from "common/socket-event";
import { TypeImageMapper, TypeProjectDataDoc } from "types/project";

const socket = io(`ws://${HOST}:${PORT}`);

socket.on("disconnect", () => {
  console.log("断开连接，重连");
  socket.connect();
});

/**
 * 注册 socket
 * 为方便定义和获取 socket 传输参数统一包装为对象
 * src/server/socket.ts
 * @param event 事件名称
 * @param callback 服务器端主动调用的方法
 * @returns 返回客户端向服务器端发送请求的方法
 */
export function registerSocketOf<R, T>(
  event: SOCKET_EVENT,
  data: { param: T; callback: (data: R) => void }
): (data: T) => typeof socket {
  socket.on(event, data.callback);
  const invoke = () => socket.emit(event, data.param);
  invoke();
  return invoke;
}

// 注册工程数据 socket
export function socketProject(
  uuid: string,
  callback: (data: TypeProjectDataDoc) => void
): (uuid: string) => typeof socket {
  return registerSocketOf(SOCKET_EVENT.PROJECT, { param: uuid, callback });
}

// 注册同步图片映射 socket
export function socketImageMapperList(
  uuid: string,
  callback: (data: TypeImageMapper[]) => void
): (uuid: string) => typeof socket {
  return registerSocketOf(SOCKET_EVENT.IMAGE_MAPPER_LIST, {
    param: uuid,
    callback
  });
}
