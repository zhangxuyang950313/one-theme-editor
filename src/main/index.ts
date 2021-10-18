import { app, BrowserWindow } from "electron";

import { startWindow } from "./windows";
import { htmlFile } from "./constant";

app.on("ready", () => {
  // 加载主窗口
  const win = startWindow();
  win.loadFile(htmlFile);

  // // 生产环境不给打开调试工具
  // win.webContents.on("devtools-opened", () => {
  //   win.webContents.closeDevTools();
  // });
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
