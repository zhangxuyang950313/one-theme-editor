import { Socket } from "socket.io";
import chokidar, { FSWatcher } from "chokidar";
import logSymbols from "log-symbols";
import { SOCKET_EVENT } from "src/common/socketConf";
import { getProjectFileData } from "server/services/project";
import { TypeErrorData, TypeWatchFilesPayload } from "src/types/socket";
import { FILE_EVENT } from "src/enum";
import { sleep } from "src/utils";

/**
 * 文件监听 map
 * 每个文件对应一个监听实例，electron 环境中好像有 bug：同一个实例中监听多个会丢事件
 */
const watcherMap = new Map<string, FSWatcher>();

// 监听文件
export function watchFiles(socket: Socket): void {
  // 断开连接关闭监听器
  socket.on("disconnect", () => {
    Promise.all(
      Array.from(watcherMap).map(([, watcher]) => watcher.close())
    ).then(() => {
      watcherMap.clear();
      console.log(logSymbols.info, "socket 断开连接，关闭文件监听器");
    });
  });
  socket.on(SOCKET_EVENT.WATCH_FILES, async (data: TypeWatchFilesPayload) => {
    console.log("监听文件变化", {
      watchFiles: data.files,
      root: data.options.cwd
    });
    data.files.forEach(file => {
      // 已存在监听器不再创建实例
      if (watcherMap.has(file)) return;

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
      const watcher = chokidar
        .watch(file, data.options)
        .setMaxListeners(1)
        .on(FILE_EVENT.ADD, file => listener(file, FILE_EVENT.ADD))
        .on(FILE_EVENT.CHANGE, file => listener(file, FILE_EVENT.CHANGE))
        .on(FILE_EVENT.UNLINK, file => listener(file, FILE_EVENT.UNLINK));
      watcherMap.set(file, watcher);
    });
  });
}

// 关闭监视器(取消监听)
export function unwatchFileAndCloseWatcher(socket: Socket): void {
  socket.on(
    SOCKET_EVENT.UNWATCH_FILES,
    async (files: TypeWatchFilesPayload["files"]) => {
      await Promise.all(
        files.map(async file => {
          await watcherMap.get(file)?.close();
          watcherMap.delete(file);
        })
      );
      socket.emit(SOCKET_EVENT.UNWATCH_FILES, null);
    }
  );
}
