import { app, BrowserWindow } from "electron";
import mainIpc from "../ipc/ipc-main";
import registerProtocol from "./protocol";
import { moveWindowToCenter, saveCurrentDisplayCenter } from "./utils";
import createWindows from "./windows";

app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    // createWindow();
  }
});

app.on("browser-window-created", (event, win) => {
  moveWindowToCenter(win);
  // saveCurrentDisplayCenter();
});

app.on("before-quit", async () => {
  await saveCurrentDisplayCenter();
});

app.on("ready", async () => {
  console.log(`主进程进程号 ${process.pid}`);
  // 注册协议
  registerProtocol();
  // 注册 ipc 服务
  mainIpc.registerServer();
  await createWindows.starter();
});
