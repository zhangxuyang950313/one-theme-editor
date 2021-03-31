import path from "path";
import { app, BrowserWindow } from "electron";

import { mainWindow } from "./windows";

app.on("ready", () => {
  // 本地文件路径定位到 app 打包后的 index.html 文件
  const html = `${path.join(app.getAppPath(), "release.renderer/index.html")}`;

  // 加载主窗口
  const win = mainWindow();
  win.loadFile(html);

  // 生产环境不给打开调试工具
  win.webContents.on("devtools-opened", () => {
    win.webContents.closeDevTools();
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
