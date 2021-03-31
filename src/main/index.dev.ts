import path from "path";
import { app, BrowserWindow } from "electron";
import electronDebug from "electron-debug";
import installExtension, {
  REDUX_DEVTOOLS,
  REACT_DEVELOPER_TOOLS
} from "electron-devtools-installer";
import createWindow from "./createWindow";

// 用于添加Chromium插件
async function setupDevTools() {
  // 安装 react 开发者工具
  return installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS]);
}

app.on("ready", () => {
  const win = createWindow();
  const html = `${path.resolve(
    app.getAppPath(),
    "../release.renderer/index.html"
  )}`;
  win.loadFile(html);
  // win.loadURL("http://localhost:3000 ");
  win.webContents.openDevTools(); // 创建并打开 dev 工具
  setupDevTools().then(() => {
    // 利用 electron-debug，添加和Chrome类似的快捷键
    electronDebug({ isEnabled: true, showDevTools: true });
  });
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
