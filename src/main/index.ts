import { app, BrowserWindow, ipcMain, protocol } from "electron";
import ipcController from "src/ipc/ipcController";
import { createWindow } from "./windowManager";
import { moveWindowToCenter, saveCurrentDisplayCenter } from "./utils";
import registerProtocol from "./protocol";

app.allowRendererProcessReuse = false;

// 桥接窗口间广播
ipcMain.on("broadcast", ($event, $data: { event: string; data: unknown }) => {
  BrowserWindow.getAllWindows().forEach(item => {
    item.webContents.send($data.event, $data.data);
  });
});

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
]);

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
  ipcController.registerIpcServer();
  await createWindow.projectManager();
});
