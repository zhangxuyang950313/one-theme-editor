import { TypePackSendPayload, TypeUnpackSendPayload } from "src/types/socket";

// socket 事件枚举
export enum SOCKET_EVENT {
  PACK = "PACK",
  UNPACK = "UNPACK",
  APPLY = "APPLY",
  OUTPUT = "OUTPUT",
  // 工程事件
  PROJECT = "PROJECT",
  // 监听资源文件
  IMAGE_MAPPER_LIST = "IMAGE_MAPPER_LIST",
  // 监听文件变化
  WATCH_PROJECT_FILE = "WATCH_PROJECT_FILE"
}

class SocketConfig {
  // 打包
  static pack = {
    event: SOCKET_EVENT.PACK,
    sendData: {} as TypePackSendPayload,
    receiveData: [] as string[]
  };
  // 解包
  static unpack = {
    event: SOCKET_EVENT.UNPACK,
    sendData: {} as TypeUnpackSendPayload,
    receiveData: [] as string[]
  };
}

export default SocketConfig;
