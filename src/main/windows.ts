import path from "path";
import {
  app,
  Menu,
  BrowserWindow,
  BrowserWindowConstructorOptions,
  ipcMain
} from "electron";
import electronDebug from "electron-debug";
import installExtension, {
  REDUX_DEVTOOLS,
  REACT_DEVELOPER_TOOLS
} from "electron-devtools-installer";
import electronStore from "../common/electronStore";
import menuTemplate from "./menu";
import { getCreateProjectUrl, isDev } from "./constant";
import registerProtocol from "./protocol";

const preload = path.resolve(app.getAppPath(), "../release.server/index");

const backgroundColor =
  electronStore.get("themeConfig")?.["@background-color"] ?? "white";

// 用于添加Chromium插件
async function setupDevTools() {
  // 安装 react 开发者工具
  return installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS]);
}

// 不能打开调试工具
function canNotOpenDevtools(win: BrowserWindow): void {
  win.webContents.on("devtools-opened", () => {
    win.webContents.closeDevTools();
  });
}

async function afterCreateWindow(win: BrowserWindow): Promise<void> {
  if (isDev) {
    // 打开 dev 工具
    win.webContents.openDevTools();
    await setupDevTools();
    // 利用 electron-debug，添加和Chrome类似的快捷键
    electronDebug({ isEnabled: true, showDevTools: true });
  } else {
    // 生产环境不允许打开调试工具
    canNotOpenDevtools(win);
  }
  // 注册协议
  registerProtocol();
}

const windowNormalizeOptions: BrowserWindowConstructorOptions = {
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

const windows = {
  // 开始窗口
  starter(): BrowserWindow {
    const win = new BrowserWindow({
      ...windowNormalizeOptions,
      webPreferences: {
        ...windowNormalizeOptions.webPreferences,
        preload
      },
      resizable: false,
      fullscreenable: false,
      show: false
    });
    win.on("ready-to-show", () => win.show());
    afterCreateWindow(win);
    return win;
  },

  // 创建工程窗口
  createProject(
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
    });
    const url = getCreateProjectUrl(scenarioSrc);
    win.loadURL(url);
    afterCreateWindow(win);
    return win;
  },

  // 工程编辑器窗口
  projectEditor(): BrowserWindow {
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
};
export default windows;
