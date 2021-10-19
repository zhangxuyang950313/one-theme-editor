import { app, BrowserWindow } from "electron";
import mainIpc from "../ipc/ipc-main";
import createWindows from "./windows";

app.on("ready", async () => {
  console.log(`主进程进程号 ${process.pid}`);
  const starter = await createWindows.starter();
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
