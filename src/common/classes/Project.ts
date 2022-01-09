import path from "path";

import { BrowserWindow } from "electron/main";
import projectDB from "main/database/project";
import dirWatcher from "main/singletons/dirWatcher";
import fileCache from "main/singletons/fileCache";
import IPC_EVENT from "src/ipc/ipc-event";
import PackageUtil from "src/common/utils/PackageUtil";

import ScenarioConfigCompiler from "./ScenarioConfigCompiler";

import type { TypeProjectDataDoc } from "src/types/project";

/**
 * 主进程维护的工程实例
 */
export default class Project {
  private options: {
    // 当前窗口实例
    views: BrowserWindow;
    // 当前工程 uuid，用于在数据库中查找工程
    uuid: string;
  };
  constructor(options: Project["options"]) {
    this.options = options;
  }

  async getProjectData(): Promise<TypeProjectDataDoc> {
    return projectDB.findProjectByQuery({ uuid: this.options.uuid });
  }

  // 初始化监听器
  async initWatcher(): Promise<void> {
    const { views } = this.options;
    views.on("close", () => {
      dirWatcher.closeWatcher(root);
    });
    const { root } = await this.getProjectData();
    // 尝试关闭这个 watcher（若存在，具体看内部逻辑）
    await dirWatcher.closeWatcher(root);
    // 创建 watcher
    // 监听工程根目录的方式给渲染进程发送文件变动事件
    dirWatcher.create(root, (event, src) => {
      // 有文件变动则取文件数据，使用缓存
      const data = fileCache.getFileData(path.join(root, src));
      // 给当前窗口渲染进程发送事件
      views.webContents.send(IPC_EVENT.$fileChange, { root, event, src, data });
    });
  }

  // 初始化后台打包器
  async initPackageBackend(): Promise<void> {
    const { root, scenarioSrc } = await this.getProjectData();
    const packageConfig = ScenarioConfigCompiler.from(scenarioSrc).getPackageConfig();
    PackageUtil.pack(root, packageConfig);
    // TODO 需要一个工程中 .9 图路径 => app.data/9patch//** 的映射
    // 打包过程中全部加载到内存
  }
}
