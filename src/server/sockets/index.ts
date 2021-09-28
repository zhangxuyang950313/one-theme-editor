import http from "http";
import { Server } from "socket.io";
import packProject from "./packProject";
import syncFileData, { cancelSyncFileData } from "./syncFileData";

export default function registerSocket(server: http.Server): void {
  // 创建 io 实例
  const io = new Server(server, {
    cors: { origin: "*" }
    // path: socketConfig.project.path
  });

  io.on("connection", socket => {
    console.log(`socket 已被连接`);
    socket.on("disconnect", () => {
      console.log("socket 断开连接");
    });
    // 打包工程
    packProject(socket);
    // 同步文件数据
    syncFileData(socket);
    // 取消同步文件数据
    cancelSyncFileData(socket);
  });
}
