import { Stats } from "fs";
import { WatchOptions, FSWatcher } from "chokidar";

/**
 * 文件监听器
 */
class FileWatcher {
  private path?: string;
  private watcher: FSWatcher;
  constructor(options: WatchOptions = {}) {
    this.watcher = new FSWatcher(options);
  }
  /**
   * 以文件路径名为事件名注册事件
   * @param filepath
   * @param listener
   */
  on(filepath: string, listener: (path: string, stats?: Stats) => void): void {
    this.watcher
      .on("add", listener)
      .on("change", listener)
      .on("unlink", listener)
      .add(filepath);
    console.debug("开始监听", filepath);
  }

  // 停止监听
  unwatch(): void {
    if (!this.path) {
      console.warn(`未监听 ${this.path}`);
      return;
    }
    this.watcher.unwatch(this.path);
    console.debug("取消监听", this.path);
  }

  // d关闭监听
  async close(): Promise<void> {
    await this.watcher.close();
    console.debug("关闭监听", this.path);
  }
}

export default FileWatcher;
