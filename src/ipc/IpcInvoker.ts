import { ipcRenderer, IpcRendererEvent } from "electron";
import { FILE_EVENT } from "src/common/enums";
import { TypeProjectData } from "src/types/project";
import { TypeFileData } from "src/types/file-data";
import IPC_EVENT from "./ipc-event";

class IpcInvoker {
  useFilesChange = (
    callback: (data: {
      root: string;
      event: FILE_EVENT;
      src: string;
      data: TypeFileData;
    }) => void
  ) => {
    const cb = (
      $event: IpcRendererEvent,
      $data: {
        root: string;
        event: FILE_EVENT;
        src: string;
        data: TypeFileData;
      }
    ) => {
      callback($data);
    };
    ipcRenderer.on(IPC_EVENT.$fileChange, cb);
    return () => {
      ipcRenderer.removeListener(IPC_EVENT.$fileChange, cb);
    };
  };

  // 给所有窗口发送广播
  sendBroadcast = {
    [IPC_EVENT.$projectCreated](data: TypeProjectData): void {
      ipcRenderer.send("broadcast", {
        event: IPC_EVENT.$projectCreated,
        data
      });
    }
  };
}
export default new IpcInvoker();
