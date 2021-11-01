import { ipcMain } from "electron";
import IPC_EVENT from "src/ipc/ipc-event";
import dirWatcher from "./dirWatcher";

// 监听 electronStore.projectPath 创建和关闭 watcher
export default function autoProjectWatcher(): void {
  $reactiveState.addSetterHook((obj, prop, value) => {
    switch (prop) {
      case "projectPath": {
        console.log("change", prop, value);
        const { projectPath } = obj;
        if (projectPath) {
          dirWatcher.create(projectPath, (event, src) => {
            ipcMain.emit(IPC_EVENT.$fileChange, { event, src });
          });
        } else {
          dirWatcher.closeAllWatcher();
        }
      }
    }
  });
}
