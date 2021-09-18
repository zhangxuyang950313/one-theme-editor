import http from "http";
import { Socket } from "socket.io";
import { SOCKET_EVENT } from "src/common/socketConf";
import projectSocket from "./projectSocket";

// 快速将 socket event 建立通讯通道
class SocketConnecter {
  private socket: Socket;
  constructor(socket: Socket) {
    this.socket = socket;
  }
  // 快速注册 socket 的通讯协议
  connect<P, R, T>(
    event: SOCKET_EVENT,
    method: (data: P, cb: (d: R) => void) => Promise<T> | T
  ) {
    this.socket.on(event, (data: P) => {
      method(data, data => {
        this.socket.emit(event, data);
      });
    });
  }
}

export default function registerSocket(server: http.Server): void {
  projectSocket(server);
}
