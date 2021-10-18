import path from "path";
import {
  app,
  Menu,
  BrowserWindow,
  BrowserWindowConstructorOptions,
  ipcMain
} from "electron";
import electronStore from "../common/electronStore";
import { getCreateProjectUrl, isDev } from "./constant";
import menuTemplate from "./menu";

const preload = path.resolve(app.getAppPath(), "../release.server/index");

const backgroundColor =
  electronStore.get("themeConfig")?.["@background-color"] ?? "white";

export const windowNormalizeOptions: BrowserWindowConstructorOptions = {
  webPreferences: {
    // https://www.electronjs.org/docs/tutorial/security#6-define-a-content-security-policy
    webSecurity: false,
    nodeIntegration: true,
    nodeIntegrationInWorker: true,
    enableRemoteModule: true,
    contextIsolation: false,
    devTools: isDev || true
    // preload
    // maximize: true
  },
  // https://www.electronjs.org/zh/docs/latest/api/browser-window#new-browserwindowoptions
  // frame: process.platform === "darwin",
  // transparent: true,
  backgroundColor,
  fullscreen: false,
  titleBarStyle: "hidden",
  frame: false,
  width: 1000,
  height: 680,
  minWidth: 1000,
  minHeight: 680
};

const menu = Menu.buildFromTemplate(menuTemplate);
// Menu.setApplicationMenu(menu);

export function startWindow(): BrowserWindow {
  return new BrowserWindow({
    ...windowNormalizeOptions,
    webPreferences: {
      ...windowNormalizeOptions.webPreferences,
      preload
    },
    resizable: false,
    fullscreenable: false
  });
}

export function createProjectWindow(
  parentWindow: BrowserWindow,
  scenarioSrc: string
): BrowserWindow {
  const win = new BrowserWindow({
    ...windowNormalizeOptions,
    width: 500,
    height: 600,
    resizable: false,
    parent: parentWindow,
    modal: true
    // show: false
  });
  win.loadURL(getCreateProjectUrl(scenarioSrc));
  // win.on("ready-to-show", () => win.show());
  return win;
}

export function editorWindow(): BrowserWindow {
  const win = new BrowserWindow({
    ...windowNormalizeOptions,
    width: 1400,
    height: 880,
    minWidth: 1000,
    minHeight: 680
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
}
