import path from "path";
import {
  app,
  Menu,
  BrowserWindow,
  BrowserWindowConstructorOptions,
  ipcMain
} from "electron";
import { isDev } from "./constant";
import menuTemplate from "./menu";

const preload = path.resolve(app.getAppPath(), "../release.server/index");

const windowNormalizeOptions: BrowserWindowConstructorOptions = {
  webPreferences: {
    // https://www.electronjs.org/docs/tutorial/security#6-define-a-content-security-policy
    webSecurity: false,
    nodeIntegration: true,
    nodeIntegrationInWorker: true,
    enableRemoteModule: true,
    contextIsolation: false,
    devTools: isDev || true,
    preload
    // maximize: true
  },
  // frame: process.platform === "darwin",
  // transparent: true,
  backgroundColor: "white"
};

export function mainWindow(): BrowserWindow {
  const win = new BrowserWindow({
    ...windowNormalizeOptions,
    // titleBarStyle: "hidden",
    width: 1400,
    height: 880,
    minWidth: 1000,
    minHeight: 680
  });

  const menu = Menu.buildFromTemplate(menuTemplate);
  // Menu.setApplicationMenu(menu);

  // 监听状态栏最大化和最小化事件
  ipcMain.on("handle-window-max-min", () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else if (win.isMaximizable()) {
      win.maximize();
    }
  });
  return win;
}
