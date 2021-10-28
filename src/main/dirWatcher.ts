import path from "path";
import { FSWatcher, WatchOptions } from "chokidar";
import { FILE_EVENT } from "src/enum";

type TypeCallback = (event: FILE_EVENT, src: string) => void;

class DirWatcher {
  private watcherMap = new Map<string, FSWatcher>();
  private callbackMap = new Map<string, TypeCallback>();

  create(root: string, callback: TypeCallback, options?: WatchOptions) {
    if (!path.isAbsolute(root)) return;
    this.callbackMap.set(root, callback);
    console.log(this.watcherMap.has(root));
    if (this.watcherMap.has(root)) return;
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
  }

  async closeWatcher(root: string): Promise<void> {
    console.log("关闭 watcher：", root);
    await this.watcherMap.get(root)?.close();
    this.watcherMap.delete(root);
  }

  async closeAllWatcher(): Promise<void> {
    const queue: Array<Promise<void>> = [];
    this.watcherMap.forEach(watcher => {
      queue.push(watcher.close());
    });
    await Promise.all(queue);
    this.watcherMap.clear();
    console.log("关闭所有 watcher");
  }
}

export default new DirWatcher();
