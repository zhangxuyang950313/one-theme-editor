import { Stats } from "fs";
import { WatchOptions, FSWatcher } from "chokidar";

/**
 * 文件监听器
 */
class FSWatcherEvent {
  private dir?: string;
  private watcher?: FSWatcher;
  private listenerList: Array<{
    filepath: string;
    listener: (path: string, stats?: Stats) => void;
  }> = [];

  // 初始化
  watch(dir: string, options: WatchOptions = {}): void {
    this.dir = dir;
    this.watcher = new FSWatcher(options);
    const onChange = (path: string, stats?: Stats) => {
      this.listenerList.forEach(item => {
        if (path !== item.filepath) return;
        item.listener(path, stats);
      });
    };
    this.watcher
      .on("add", onChange)
      .on("change", onChange)
      .on("unlink", onChange)
      .add(dir);
    console.debug("开始监听", this.dir);
  }

  /**
   * 以文件路径名为事件名注册事件
   * @param filepath
   * @param listener
   */
  on(filepath: string, listener: (path: string, stats?: Stats) => void): void {
    this.listenerList.push({ filepath, listener });
  }

  /**
   * 移除监听
   * @param filepath
   */
  unListener(filepath: string): void {
    this.listenerList = this.listenerList.filter(
      item => item.filepath !== filepath
    );
  }

  /**
   * 停止监听
   */
  unwatch(): void {
    if (!this.dir) {
      console.warn(`未监听 ${this.dir}`);
      return;
    }
    this.watcher?.unwatch(this.dir);
    console.debug("取消监听", this.dir);
  }

  async close(): Promise<void> {
    await this.watcher?.close();
    console.debug("关闭监听", this.dir);
  }
}

export default FSWatcherEvent;
