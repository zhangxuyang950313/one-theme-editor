import { Socket } from "socket.io";
import { FSWatcher, WatchOptions } from "chokidar";
import { SOCKET_EVENT } from "src/common/socketConf";
import { getProjectFileData } from "server/services/project";
import { TypeErrorData } from "src/types/socket";
import { FILE_EVENT } from "src/enum";

// 监听文件
export function watchFileData(socket: Socket): void {
  socket.on(
    SOCKET_EVENT.WATCH_FILES,
    (data: {
      options: WatchOptions;
      files: string | ReadonlyArray<string>;
    }) => {
      console.log(data);
      const watcher = new FSWatcher(data.options);
      const listener = (file: string, event: FILE_EVENT) => {
        if (!data.options.cwd) {
          socket.emit(SOCKET_EVENT.ERROR, {
            event: SOCKET_EVENT.FILE_CHANGE,
            message: "初始化文件监听器未设置 projectRoot"
          } as TypeErrorData);
          return;
        }
        const fileData = getProjectFileData(data.options.cwd, file);
        socket.emit(SOCKET_EVENT.FILE_CHANGE, { file, event, data: fileData });
      };
      watcher
        .on(FILE_EVENT.ADD, file => listener(file, FILE_EVENT.ADD))
        .on(FILE_EVENT.CHANGE, file => listener(file, FILE_EVENT.CHANGE))
        .on(FILE_EVENT.UNLINK, file => listener(file, FILE_EVENT.UNLINK))
        .add(data.files);
    }
  );
}

// // 取消监听
// export function unwatchFileData(socket: Socket): void {
//   const { event, sendData, receiveData } = SocketConfig.unwatchFiles;
//   // socket.on(SOCKET_EVENT.UNWATCH_FILES, (data: TypeWatchFilePayload) => {
//   //   if (!watcher) return;
//   //   watcher.unwatch(data);
//   //   socket.emit(SOCKET_EVENT.UNWATCH_FILES, null);
//   // });
//   new SocketInvoker<typeof receiveData, typeof sendData>(socket)
//     .event(event)
//     .on(async (data, emit) => {
//       if (!watcher) return;
//       watcher.unwatch(data);
//       emit(null);
//     });
// }
