// socket 事件枚举
export enum SOCKET_EVENT {
  PACK = "PACK",
  APPLY = "APPLY",
  OUTPUT = "OUTPUT",
  // 工程事件
  PROJECT = "PROJECT",
  // 监听资源文件
  IMAGE_MAPPER_LIST = "IMAGE_MAPPER_LIST",
  // 监听文件变化
  WATCH_PROJECT_FILE = "WATCH_FILE"
}

class SocketConfig {
  private static PREFIX = "/socket.io";

  static project = {
    namespace: "project",
    pack: {
      event: SOCKET_EVENT.PACK
    },
    apply: {
      event: SOCKET_EVENT.APPLY
    },
    output: {
      event: SOCKET_EVENT.OUTPUT
    }
  };
}

export default SocketConfig;
