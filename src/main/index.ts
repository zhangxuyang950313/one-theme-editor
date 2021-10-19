import { app, BrowserWindow } from "electron";
import mainIpc from "../ipc/main/ipc-manager";
import windows from "./windows";
import { getStarterUrl } from "./constant";

app.on("ready", () => {
  console.log(`主进程进程号 ${process.pid}`);
  const url = getStarterUrl();
  const starter = windows.starter();
  starter.loadURL(url);
  mainIpc.registerServer();
  mainIpc.registerOpenCreateProject(starter);
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
