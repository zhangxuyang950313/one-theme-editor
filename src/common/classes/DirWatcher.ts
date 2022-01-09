import path from "path";

import { FSWatcher, WatchOptions } from "chokidar";

import { FILE_EVENT } from "../enums";

type TypeCallback = (event: FILE_EVENT, src: string) => void;
export type TypeWatchedRecord = Record<
  string,
  ReturnType<FSWatcher["getWatched"]>
>;

/**
 * 目录监听器，单实例支持创建多个目录的监听
 */
class DirWatcher {
  private watcherMap = new Map<string, FSWatcher>();
  private callbackMap = new Map<string, TypeCallback>();

  create(
    root: string,
    callback: TypeCallback,
    options?: WatchOptions
  ): FSWatcher | null {
    if (!path.isAbsolute(root)) return null;
    this.callbackMap.set(root, callback);
    const same = this.watcherMap.get(root);
    if (same) return same;
    console.log("创建 watcher", root);
    const watcher = new FSWatcher({
      cwd: root,
      persistent: true, // 尽可能保持进程
      usePolling: true, // poll 模式
      ignoreInitial: true, // 初始化触发 add
      followSymlinks: false,
      atomic: false, // unlink 后超过 interval(atomic=true) 或 1 秒内重新被 add，则触发 change
      alwaysStat: true,
      ignorePermissionErrors: true,
      interval: 0,
      ...(options || {})
    }).setMaxListeners(9999);
    const listener = (event: FILE_EVENT, src: string) => {
      console.log("文件变动", event, src);
      const callback = this.callbackMap.get(root);
      if (callback) callback(event, src);
    };
    watcher
      .on(FILE_EVENT.ADD, file => listener(FILE_EVENT.ADD, file))
      .on(FILE_EVENT.CHANGE, file => listener(FILE_EVENT.CHANGE, file))
      .on(FILE_EVENT.UNLINK, file => listener(FILE_EVENT.UNLINK, file))
      .add("./**/*{.xml,.png,.9.png,.jpg,.jpeg,.webp}");

    this.watcherMap.set(root, watcher);
    return watcher;
  }

  // 关闭一个 watcher，用 dir 来进行区分
  async closeWatcher(root: string): Promise<void> {
    const watcher = this.watcherMap.get(root);
    if (watcher) {
      console.log("关闭 watcher：", root);
      await watcher.close();
      this.watcherMap.delete(root);
    }
  }

  // 关闭所有 watcher
  async closeAllWatcher(): Promise<void> {
    const queue: Array<Promise<void>> = [];
    this.watcherMap.forEach(watcher => {
      queue.push(watcher.close());
    });
    await Promise.all(queue);
    this.watcherMap.clear();
    console.log("关闭所有 watcher");
  }

  getWatchedRecord(): TypeWatchedRecord {
    const result: TypeWatchedRecord = {};
    this.watcherMap.forEach((watcher, root) => {
      result[root] = watcher.getWatched();
    });
    return result;
  }
}

export default DirWatcher;
