import io from "socket.io-client";
import { HOST, PORT } from "common/config";
import SOCKET_EVENT from "common/socketEvent";
import { TypeProjectDataDoc } from "types/project";

const socket = io(`ws://${HOST}:${PORT}`);

socket.on("disconnect", () => {
  console.log("断开连接，重连");
  socket.connect();
});

/**
 * 注册 socket
 * @param event 事件名称
 * @param callback 服务器端主动调用的方法
 * @returns 返回客户端向服务器端发送请求的方法
 */
export function registerSocketOf<R, T>(
  event: SOCKET_EVENT,
  data: {
    params: T;
    callback: (data: R) => void;
  }
): (data: T) => typeof socket {
  socket.on(event, data.callback);
  const invoke = () => socket.emit(event, data.params);
  invoke();
  return invoke;
}

// 注册工程数据 socket
export function socketProject(
  params: string,
  callback: (data: TypeProjectDataDoc) => void
): (uuid: string) => typeof socket {
  return registerSocketOf<TypeProjectDataDoc, string>(SOCKET_EVENT.PROJECT, {
    params,
    callback
  });
}
