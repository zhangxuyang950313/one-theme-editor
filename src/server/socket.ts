import http from "http";
import { Server } from "socket.io";
import SOCKET_EVENT from "common/socketEvent";
import { findProjectByUUID } from "./db-handler/project";

export default function registerSocket(server: http.Server): void {
  const io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", socket => {
    console.log("socket 已被链接");
    socket.emit("hello", "服务已收到你的连接...");
    socket.on("disconnect", () => {
      console.log("断开连接");
    });

    // 同步工程数据
    socket.on(SOCKET_EVENT.PROJECT, uuid => {
      findProjectByUUID(uuid).then(project => {
        socket.emit(SOCKET_EVENT.PROJECT, project);
      });
    });
  });
}
