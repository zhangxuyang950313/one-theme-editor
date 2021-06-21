import io from "socket.io-client";
import { PORT } from "common/config";
import SOCKET_EVENT from "common/socketEvent";
import { TypeProjectDataDoc } from "types/project";

const socket = io(`http://localhost:${PORT}`);

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
  callback: (data: R) => void
): (data: T) => typeof socket {
  socket.on(event, callback);
  return (data: T) => socket.emit(event, data);
}

// 注册工程数据 socket
export const registerSocket = {
  project(
    callback: (data: TypeProjectDataDoc) => void
  ): (data: { uuid: string }) => typeof socket {
    return registerSocketOf<TypeProjectDataDoc, { uuid: string }>(
      SOCKET_EVENT.PROJECT,
      callback
    );
  }
};
