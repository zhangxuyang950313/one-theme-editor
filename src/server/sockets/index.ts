import http from "http";
import { Server } from "socket.io";
import packProject from "./packProject";

export default function registerSocket(server: http.Server): void {
  // 创建 io 实例
  const io = new Server(server, {
    cors: { origin: "*" }
    // path: socketConfig.project.path
  });

  io.on("connection", socket => {
    // 打包工程
    packProject(socket);
  });
}
