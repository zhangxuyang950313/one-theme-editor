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
import { getUrl, isDev } from "./constant";
import menuTemplate from "./menu";

// const preload = path.resolve(app.getAppPath(), "../release.server/index");
const preload = path.resolve(app.getAppPath(), "../release.main/preload");

const backgroundColor =
  electronStore.get("themeConfig")?.["@background-color"] ?? "white";

// 用于添加Chromium插件
async function setupDevTools() {
  // 安装 react 开发者工具
  return installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS]);
}

async function devToolsHandler(win: BrowserWindow): Promise<void> {
  await new Promise(resolve => win.on("ready-to-show", resolve));
  if (isDev) {
    // 打开 dev 工具
    win.webContents.openDevTools();
    await setupDevTools();
    // 利用 electron-debug，添加和Chrome类似的快捷键
    electronDebug({ isEnabled: true, showDevTools: true });
  } else {
    // 生产环境不允许打开调试工具
    win.webContents.on("devtools-opened", () => {
      win.webContents.closeDevTools();
    });
  }
}

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
  // center: true,
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

Menu.buildFromTemplate(menuTemplate);
// Menu.setApplicationMenu(menu);

const createWindows = {
  // 开始窗口
  async starter(): Promise<BrowserWindow> {
    const win = new BrowserWindow({
      ...windowNormalizeOptions,
      resizable: false,
      fullscreenable: false,
      show: false
    });
    devToolsHandler(win);
    win.loadURL(getUrl.starter());
    win.on("ready-to-show", () => win.show());
    return win;
  },

  // 创建工程窗口
  async createProject(scenarioSrc: string): Promise<BrowserWindow> {
    const win = new BrowserWindow({
      ...windowNormalizeOptions,
      width: 500,
      height: 600,
      resizable: false,
      parent: BrowserWindow.getFocusedWindow() || undefined,
      modal: true
    });
    devToolsHandler(win);
    await win.loadURL(getUrl.createProject(scenarioSrc));
    return win;
  },

  // 工程编辑器窗口
  async projectEditor(uuid: string): Promise<BrowserWindow> {
    const win = new BrowserWindow({
      ...windowNormalizeOptions,
      width: 1400,
      height: 880,
      minWidth: 1000,
      minHeight: 680
    });
    devToolsHandler(win);
    await win.loadURL(getUrl.projectEditor(uuid));

    // 编辑器窗口管理回到开始页面
    win.on("close", async () => {
      await this.starter();
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
export default createWindows;
