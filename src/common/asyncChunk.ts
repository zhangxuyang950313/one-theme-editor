/**
 * 管理异步加载模块
 */
import { app, BrowserWindow } from "electron";

import type { create as projectManager } from "main/windows/project-manager";
import type fileCache from "main/singletons/fileCache";
import type projectDatabase from "main/database/project";
import type dirWatcher from "main/singletons/dirWatcher";

export async function chunkProjectDB(): Promise<typeof projectDatabase> {
  return (await import("main/database/project")).default;
}

export async function chunkDirWatcher(): Promise<typeof dirWatcher> {
  return (await import("main/singletons/dirWatcher")).default;
}

export async function chunkFileCache(): Promise<typeof fileCache> {
  return (await import("main/singletons/fileCache")).default;
}

// createWindows 方法内调用了 electron.app 获取路径方法，
// 需要在 electron 启动后才能调用，
// 所以要检测是否已经加载窗口，然后异步加载
export async function chunkCreateProjectEditorWin(uuid: string): Promise<BrowserWindow> {
  // 处理边界情况：若未启动前调用，则等待 ready
  if (!app.isReady()) {
    await new Promise(resolve => app.on("ready", resolve));
  }
  return (await import("main/windows/project-editor")).create(uuid);
}

export async function chunkCreateProjectManagerWin(): Promise<typeof projectManager> {
  // 处理边界情况：若未启动前调用，则等待 ready
  if (!app.isReady()) {
    await new Promise(resolve => app.on("ready", resolve));
  }
  return (await import("main/windows/project-manager")).create;
}
