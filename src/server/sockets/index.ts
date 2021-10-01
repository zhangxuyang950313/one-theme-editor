import http from "http";
import { Server } from "socket.io";
import logSymbols from "log-symbols";
import packProject from "./packProject";
import { unwatchFileAndCloseWatcher, watchFiles } from "./fileWatcher";

export default function registerSocket(server: http.Server): void {
  // 创建 io 实例
  const io = new Server(server, {
    cors: { origin: "*" }
    // path: socketConfig.project.path
  });

  io.on("connection", socket => {
    console.log(logSymbols.success, `socket 已被连接`, socket.id);
    socket.on("disconnect", () => {
      console.log(logSymbols.info, "socket 断开连接");
    });
    // 打包工程
    packProject(socket);
    // 监听文件
    watchFiles(socket);
    // 取消监听并关闭
    unwatchFileAndCloseWatcher(socket);
  });
}
