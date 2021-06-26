import http from "http";
import { Server, Socket } from "socket.io";
import SOCKET_EVENT from "common/socket-event";
import { findProjectByUUID } from "./db-handler/project";
import { syncImageMapperList } from "./core/socketSync";

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
  // 创建 io 实例
  const io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", socket => {
    console.log("socket 已被链接");
    socket.emit("hello", "服务已收到你的连接...");
    socket.on("disconnect", () => console.log("断开连接"));

    // 创建调用实例
    // const connecter = new SocketConnecter(socket);
    // 同步工程数据

    // connecter.connect(SOCKET_EVENT.PROJECT, (uuid: string) => {
    //   findProjectByUUID(uuid).then(project => {
    //     socket.emit(SOCKET_EVENT.PROJECT, project);
    //   });
    // });

    // // 同步工程数据，connect 对以下代码做了封装，等同于上面的 invoke 方法
    // socket.on(SOCKET_EVENT.PROJECT, uuid => {
    //   findProjectByUUID(uuid).then(project => {
    //     socket.emit(SOCKET_EVENT.PROJECT, project);
    //   });
    // });

    // 监听 image 素材
    // connecter.connect(SOCKET_EVENT.IMAGE_MAPPER_LIST, syncImageMapperList);
  });
}
