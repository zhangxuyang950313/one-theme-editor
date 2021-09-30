import {
  TypePackProcess,
  TypePackPayload,
  TypeUnpackPayload,
  TypeSyncFileContent,
  TypeWatchFilePayload,
  TypeCreateFileWatcherPayload
} from "src/types/socket";

// socket 事件枚举
export enum SOCKET_EVENT {
  PACK = "PACK", // 打包
  UNPACK = "UNPACK", // 解包
  APPLY = "APPLY", // 应用
  OUTPUT = "OUTPUT", // 导出

  ERROR = "ERROR", // 错误

  CREATE_FILE_WATCHER = "CREATE_FILE_WATCHER", // 创建文件监视器
  CLOSE_FILE_WATCHER = "CLOSE_FILE_WATCHER", // 关闭文件监视器
  WATCH_FILES = "WATCH_FILES", // 监听文件
  UNWATCH_FILES = "UNWATCH_FILES", // 取消监听文件
  FILE_CHANGE = "FILE_CHANGE" // 文件变动
}

class SocketConfig {
  static pack = {
    event: SOCKET_EVENT.PACK,
    sendData: {} as TypePackPayload,
    receiveData: {} as TypePackProcess
  };
  static unpack = {
    event: SOCKET_EVENT.UNPACK,
    sendData: {} as TypeUnpackPayload,
    receiveData: {} as TypePackProcess
  };
  static createFileWatcher = {
    event: SOCKET_EVENT.CREATE_FILE_WATCHER,
    sendData: {} as TypeCreateFileWatcherPayload,
    receiveData: null
  };
  static watchFiles = {
    event: SOCKET_EVENT.WATCH_FILES,
    sendData: {} as TypeWatchFilePayload,
    receiveData: null
  };
  static unwatchFiles = {
    event: SOCKET_EVENT.UNWATCH_FILES,
    sendData: {} as TypeWatchFilePayload,
    receiveData: null
  };
  static fileChange = {
    event: SOCKET_EVENT.FILE_CHANGE,
    sendData: null,
    receiveData: {} as TypeSyncFileContent
  };
}

export default SocketConfig;
