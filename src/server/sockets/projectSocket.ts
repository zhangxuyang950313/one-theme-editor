import http from "http";
import { Server } from "socket.io";
import socketConfig from "src/common/socketConf";

export default function projectSocket(server: http.Server): void {
  const { namespace, pack } = socketConfig.project;
  // 创建 io 实例
  const io = new Server(server, {
    cors: { origin: "*" }
    // path: socketConfig.project.path
  });

  io.on("connection", socket => {
    console.log(`socket 已被连接 ${namespace}`);
    socket.emit("hello", "服务已收到你的连接...");
    socket.on("disconnect", () => console.log("断开连接"));

    // 创建调用实例
    // const connecter = new SocketConnecter(socket);
    // 打包工程
    socket.on(
      pack.event,
      (param: {
        scenarioMd5: string;
        unpackFile: string;
        outputDir: string;
      }) => {
        console.log(param);
        setTimeout(() => {
          socket.emit(pack.event, param);
        }, 1000);
      }
    );
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

    // 监听文件
    // connecter.connect(SOCKET_EVENT.IMAGE_MAPPER_LIST, syncImageMapperList);
    // socket.on(SOCKET_EVENT.WATCH_FILE, ({ uuid, list }) => {
    //   watchFiles(uuid, list, data => {
    //     socket.emit(SOCKET_EVENT.WATCH_FILE, data);
    //   });
    // });
  });
}
