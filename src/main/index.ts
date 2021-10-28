import { app, BrowserWindow } from "electron";
import { registerReactiveStateMain } from "src/preload/ReactiveState";
import mainIpc from "src/ipc/ipc-main";
// import autoProjectWatcher from "./autoProjectWatcher";
import registerProtocol from "./protocol";
import createWindows from "./windows";
import { moveWindowToCenter, saveCurrentDisplayCenter } from "./utils";

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
  saveCurrentDisplayCenter();
});

app.on("before-quit", () => {
  saveCurrentDisplayCenter();
});

app.on("ready", async () => {
  console.log(`主进程进程号 ${process.pid}`);
  // 注册协议
  registerProtocol();
  // 注册 ipc 服务
  mainIpc.registerServer();
  // 注册主进程响应式数据
  registerReactiveStateMain();
  // 注册工程目录监听器
  // autoProjectWatcher();
  await createWindows.starter();
});
