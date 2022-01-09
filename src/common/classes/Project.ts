import path from "path";

import projectDB from "src/main/database/project";
import dirWatcher from "main/singletons/dirWatcher";
import fileCache from "main/singletons/fileCache";
import IPC_EVENT from "src/ipc/ipc-event";
import { BrowserWindow } from "electron/main";

/**
 * 工程实例
 */
export default class Project {
  private uuid: string;
  constructor(uuid: string) {
    this.uuid = uuid;
  }

  // 初始化监听器
  async initWatcher(win: BrowserWindow): Promise<void> {
    win.on("close", () => {
      dirWatcher.closeWatcher(root);
    });
    const { root } = await projectDB.findProjectByQuery({ uuid: this.uuid });
    // 尝试关闭这个 watcher（若存在，具体看内部逻辑）
    await dirWatcher.closeWatcher(root);
    // 创建 watcher
    // 监听工程根目录的方式给渲染进程发送文件变动事件
    dirWatcher.create(root, (event, src) => {
      // 有文件变动则取文件数据，使用缓存
      const data = fileCache.getFileData(path.join(root, src));
      // 给当前窗口渲染进程发送事件
      win.webContents.send(IPC_EVENT.$fileChange, { root, event, src, data });
    });
  }
}
