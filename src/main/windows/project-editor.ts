import { BrowserWindow, ipcMain, Menu } from "electron";
import * as remoteMain from "@electron/remote/main";
import { getUrl } from "main/constant";
import Project from "src/common/classes/Project";

import menuTemplate from "../menu";

import windowNormalizeOptions from "./options";
import { devToolsHandler } from "./devtools";
import { create as createProjectManager } from "./project-manager";

Menu.buildFromTemplate(menuTemplate);

// 工程编辑器窗口
export const create = async (uuid: string): Promise<BrowserWindow> => {
  const win = new BrowserWindow({
    ...windowNormalizeOptions,
    width: 1400,
    height: 880,
    minWidth: 1000,
    minHeight: 680
  });
  remoteMain.enable(win.webContents);
  devToolsHandler(win);
  await win.loadURL(getUrl.projectEditor(uuid));

  // 初始化工程实例
  const project = new Project({ views: win, uuid });
  project.initWatcher();

  // 编辑器窗口管理回到开始页面
  win.on("close", async () => {
    await createProjectManager();
  });

  // 监听状态栏最大化和最小化事件
  ipcMain.on("handle-window-max-min", () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else if (win.isMaximizable()) {
      win.maximize();
    }
  });
  return win;
};
