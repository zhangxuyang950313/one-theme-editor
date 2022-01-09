import { Menu, BrowserWindow, BrowserWindowConstructorOptions, ipcMain } from "electron";
import * as remoteMain from "@electron/remote/main";
import { isPackaged } from "src/common/utils";

// import * as electronStore from "../store/index";

import Project from "src/common/classes/Project";

import { preloadFile, getUrl } from "./constant";
import menuTemplate from "./menu";

// const backgroundColor =
//   electronStore.config.get("themeConfig")?.["@background-color"] ?? "white";

const backgroundColor = "#000000";

// 用于添加Chromium插件
async function setupDevTools() {
  // 安装 react 开发者工具
  const {
    default: installExtension,
    // REDUX_DEVTOOLS,
    REACT_DEVELOPER_TOOLS
  } = await import("electron-devtools-installer");
  return installExtension([
    // REDUX_DEVTOOLS,
    REACT_DEVELOPER_TOOLS
  ]);
}

async function devToolsHandler(win: BrowserWindow): Promise<void> {
  // await new Promise(resolve => win.on("ready-to-show", resolve));
  if (!isPackaged) {
    // 打开 dev 工具
    win.webContents.openDevTools();
    await setupDevTools().catch(err => {
      console.log("Dev tools install failed.", err);
    });
    // 利用 electron-debug，添加和Chrome类似的快捷键
    // import("electron-debug").then(debug => {
    //   debug.default({ isEnabled: true, showDevTools: true });
    //   debug.openDevTools();
    // });
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    // require("devtron").install();
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
    webSecurity: true,
    nodeIntegration: true,
    nodeIntegrationInWorker: true,
    allowRunningInsecureContent: false,
    // enableRemoteModule: true,
    contextIsolation: false,
    devTools: isPackaged || true,
    preload: preloadFile,
    zoomFactor: 1.0
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

export const createWindow = {
  // 开始窗口
  async projectManager(): Promise<BrowserWindow> {
    const win = new BrowserWindow({
      ...windowNormalizeOptions,
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
    remoteMain.enable(win.webContents);
    devToolsHandler(win);
    await win.loadURL(getUrl.projectEditor(uuid));

    // 初始化工程实例
    const project = new Project(uuid);
    project.initWatcher(win);

    // 编辑器窗口管理回到开始页面
    win.on("close", async () => {
      await this.projectManager();
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
