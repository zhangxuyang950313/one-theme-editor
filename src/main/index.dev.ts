import { app, BrowserWindow, ipcMain } from "electron";
import electronDebug from "electron-debug";
import installExtension, {
  REDUX_DEVTOOLS,
  REACT_DEVELOPER_TOOLS
} from "electron-devtools-installer";
import IPC_EVENT from "../enum/ipc-event";
import ScenarioConfigCompiler from "../server/compiler/ScenarioConfig";
import ScenarioOptions from "../server/compiler/ScenarioOptions";
import { getStarterUrl, isDev } from "./constant";
import { createProjectWindow, startWindow } from "./windows";
import registerProtocol from "./protocol";

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

async function afterCreateWindow(win: BrowserWindow) {
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

app.on("ready", () => {
  console.log(`主进程进程号 ${process.pid}`);
  const win = startWindow();
  win.loadURL(getStarterUrl());
  afterCreateWindow(win);

  // 监听打开创建工程窗口
  ipcMain.on(
    IPC_EVENT.$openCreateProjectWindow,
    (event, scenarioSrc: string) => {
      const createProjectWin = createProjectWindow(win, scenarioSrc);
      afterCreateWindow(createProjectWin);
      event.reply(IPC_EVENT.$openCreateProjectWindow);
    }
  );
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    // createWindow();
  }
});

// server

ipcMain.on(IPC_EVENT.$getScenarioOption, (event, scenarioMd5: string) => {
  const scenarioOptions = ScenarioOptions.readScenarioOptionList();
  const scenario = scenarioOptions.find(o => o.md5 === scenarioMd5);
  const scenarioConfig = ScenarioConfigCompiler.from(scenario.src).getConfig();
  event.reply(IPC_EVENT.$getScenarioOption, scenarioConfig);
});
