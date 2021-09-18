import io from "socket.io-client";
import { HOST, PORT } from "src/common/config";
import socketConfig, { SOCKET_EVENT } from "src/common/socketConf";

const URL = `http://${HOST}:${PORT}`;

const project = io(`${URL}`);

project.on("disconnect", () => {
  console.log("断开连接，重连");
  project.connect();
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
): (data: T) => typeof project {
  project.on(event, data.callback);
  const invoke = () => project.emit(event, data.param);
  invoke();
  return invoke;
}

export function socketPackProject(
  param: {
    brandMd5: string;
    packFile: string;
    outputDir: string;
  },
  callback: (x: string[]) => void
): (x: {
  brandMd5: string;
  packFile: string;
  outputDir: string;
}) => typeof project {
  return registerSocketOf(SOCKET_EVENT.PACK, { param, callback });
}
