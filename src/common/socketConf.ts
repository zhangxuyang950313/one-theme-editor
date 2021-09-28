import {
  TypePackProcess,
  TypePackPayload,
  TypeUnpackPayload,
  TypeSyncFileContent,
  TypeSyncFileContentPayload
} from "src/types/socket";

// socket 事件枚举
export enum SOCKET_EVENT {
  PACK = "PACK", // 打包
  UNPACK = "UNPACK", // 解包
  APPLY = "APPLY", // 应用
  OUTPUT = "OUTPUT", // 导出
  SYNC_FILE_CONTENT = "SYNC_FILE_CONTENT", // 同步文件内容
  CANCEL_SYNC_FILE_CONTENT = "OUT_SYNC_FILE_CONTENT", // 取消同步文件内容
  PROJECT = "PROJECT", // 工程事件
  IMAGE_MAPPER_LIST = "IMAGE_MAPPER_LIST", // 监听资源文件
  WATCH_PROJECT_FILE = "WATCH_PROJECT_FILE" // 监听文件变化
}

class SocketConfig {
  // 打包
  static pack = {
    event: SOCKET_EVENT.PACK,
    sendData: {} as TypePackPayload,
    receiveData: {} as TypePackProcess
  };
  // 解包
  static unpack = {
    event: SOCKET_EVENT.UNPACK,
    sendData: {} as TypeUnpackPayload,
    receiveData: {} as TypePackProcess
  };
  // 同步文件
  static syncFileContent = {
    event: SOCKET_EVENT.SYNC_FILE_CONTENT,
    sendData: {} as TypeSyncFileContentPayload,
    receiveData: {} as TypeSyncFileContent
  };
  // 取消同步文件数据
  static cancelSyncFileContent = {
    event: SOCKET_EVENT.CANCEL_SYNC_FILE_CONTENT,
    sendData: {} as TypeSyncFileContentPayload,
    receiveData: null
  };
}

export default SocketConfig;
