import { BrowserWindow } from "electron";
import * as remoteMain from "@electron/remote/main";
import { getUrl } from "main/constant";

import normalizeOptions from "./options";
import { devToolsHandler } from "./devtools";

// 开始窗口
export const create = async (): Promise<BrowserWindow> => {
  const win = new BrowserWindow({
    ...normalizeOptions,
    width: 1080,
    height: 720,
    minWidth: 1080,
    minHeight: 720,
    resizable: false,
    fullscreenable: false,
    show: true
  });
  remoteMain.enable(win.webContents);
  devToolsHandler(win);
  win.loadURL(getUrl.projectManager());
  // win.loadURL(getUrl.projectEditor("6d312b14-2013-42e2-93d3-3e64beda25d1"));
  win.on("ready-to-show", () => win.show());
  return win;
};
