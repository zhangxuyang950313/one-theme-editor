import logSymbols from "log-symbols";
import { Socket } from "socket.io";
import { FSWatcher } from "chokidar";
import { SOCKET_EVENT } from "src/common/socketConf";
import { getProjectFileData } from "server/services/project";
import { TypeErrorData, TypeWatchFilesPayload } from "src/types/socket";
import { FILE_EVENT } from "src/enum";
import { sleep } from "src/utils";

let watcher: FSWatcher | null = null;

// 监听文件
export function watchFiles(socket: Socket): void {
  // 断开连接关闭监听器
  socket.on("disconnect", async () => {
    if (!watcher) return;
    await watcher.close();
    console.log(logSymbols.info, "socket 断开连接，关闭文件监听器");
  });
  socket.on(SOCKET_EVENT.WATCH_FILES, async (data: TypeWatchFilesPayload) => {
    console.log("监听文件变化", {
      watchFiles: data.files,
      root: data.options.cwd
    });
    if (watcher) {
      await watcher.close();
    } else {
      watcher = new FSWatcher(data.options);
    }
    const listener = async (file: string, event: FILE_EVENT) => {
      if (!data.options.cwd) {
        socket.emit(SOCKET_EVENT.ERROR, {
          event: SOCKET_EVENT.FILE_CHANGE,
          message: "初始化文件监听器未设置 projectRoot"
        } as TypeErrorData);
        return;
      }
      await sleep(0);
      const fileData = getProjectFileData(data.options.cwd, file);
      socket.emit(SOCKET_EVENT.FILE_CHANGE, { file, event, data: fileData });
    };
    watcher
      .on(FILE_EVENT.ADD, file => listener(file, FILE_EVENT.ADD))
      .on(FILE_EVENT.CHANGE, file => listener(file, FILE_EVENT.CHANGE))
      .on(FILE_EVENT.UNLINK, file => listener(file, FILE_EVENT.UNLINK))
      .add(data.files);
  });
}

export function unwatchFiles(socket: Socket): void {
  socket.on(
    SOCKET_EVENT.UNWATCH_FILES,
    (files: TypeWatchFilesPayload["files"]) => {
      if (!watcher) return;
      watcher.unwatch(files);
      socket.emit(SOCKET_EVENT.UNWATCH_FILES, null);
    }
  );
}

// 关闭监听器
export function closeFileWatcher(socket: Socket): void {
  socket.on(SOCKET_EVENT.UNWATCH_FILES, async () => {
    if (!watcher) return;
    await watcher.close();
    socket.emit(SOCKET_EVENT.UNWATCH_FILES, null);
  });
}
