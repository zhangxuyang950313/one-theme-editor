import path from "path";
import { Server, Socket } from "socket.io";
import chokidar, { FSWatcher } from "chokidar";
import logSymbols from "log-symbols";
import { SOCKET_EVENT } from "src/constant/socketConf";
import { getFileData } from "server/services/project";
import { TypeErrorData, TypeWatchFilesPayload } from "src/types/socket";
import { FILE_EVENT } from "src/enum";
import { sleep } from "src/common/utils";

/**
 * 文件监听 map
 * 每个文件对应一个监听实例，由于 electron 环境中好像有 bug：同一个实例中监听多个会丢事件
 */
const watcherMap = new Map<string, FSWatcher>();

// 添加固定的三种监听事件
function addWatcherListener(
  watcher: FSWatcher,
  callback: (file: string, event: FILE_EVENT) => Promise<void>
): FSWatcher {
  return watcher
    .setMaxListeners(1)
    .on(FILE_EVENT.ADD, file => callback(file, FILE_EVENT.ADD))
    .on(FILE_EVENT.CHANGE, file => callback(file, FILE_EVENT.CHANGE))
    .on(FILE_EVENT.UNLINK, file => callback(file, FILE_EVENT.UNLINK));
}

// 监听文件
export function watchFiles(socket: Socket, io: Server): void {
  // 给 socket 绑定监听器
  const bindListener = (watcher: FSWatcher) => {
    const root = watcher.options.cwd;
    if (!root) return;
    addWatcherListener(watcher, async (file, event) => {
      await sleep(0); // 异步化
      const fileData = getFileData(path.join(root, file), file);
      socket.emit(SOCKET_EVENT.FILE_CHANGE, { file, event, data: fileData });
    });
  };
  // 连接若在此之前没有被取消监视的文件重建监听
  io.on("connection", () => {
    if (watcherMap.size === 0) return;
    console.log("watcher socket 已被链接，重建未取消的文件监听", watcherMap);
    watcherMap.forEach(bindListener);
  });
  // 断开连接
  socket.on("disconnect", async () => {
    // 为保证非正常断开连接恢复，不删除 map，只 close (内部同时 removeAllListeners，再次连接检测 listenersCount)
    await Promise.all(Array.from(watcherMap).map(o => o[1].close()));
    // watcherMap.clear(); // 删除监听器，但不删除实例，不要执行这行代码
    console.log(logSymbols.info, "socket 断开连接，关闭文件监听器");
  });
  // 接收文件监听请求
  socket.on(SOCKET_EVENT.WATCH_FILES, async (data: TypeWatchFilesPayload) => {
    console.log("监听文件变化", {
      watchFiles: data.files,
      root: data.options.cwd
    });
    data.files.forEach(file => {
      // 若已有正常工作的监听器，不创建实例
      if (watcherMap.get(file)?.listeners.length) {
        return;
      }
      // // 已存在监听器不再创建实例
      // if (watcherMap.has(file)) return;
      if (!data.options.cwd) {
        socket.emit(SOCKET_EVENT.ERROR, {
          event: SOCKET_EVENT.FILE_CHANGE,
          message: "初始化文件监听器未设置 projectRoot"
        } as TypeErrorData);
        return;
      }
      const watcher = chokidar.watch(file, data.options);
      bindListener(watcher);
      watcherMap.set(file, watcher);
    });
  });
}

// 取消监听 (关闭并释放监视器)
export function unwatchFileAndCloseWatcher(socket: Socket): void {
  socket.on(
    SOCKET_EVENT.UNWATCH_FILES,
    async (files: TypeWatchFilesPayload["files"]) => {
      console.log("取消监听文件变化", files);
      await Promise.all(
        files.map(async file => {
          // close 为异步操作，先缓存一份，相同的文件才能保证 hooks 先删掉再监听
          const watcher = watcherMap.get(file);
          watcherMap.delete(file);
          await watcher?.close();
        })
      );
      socket.emit(SOCKET_EVENT.UNWATCH_FILES, null);
    }
  );
}
