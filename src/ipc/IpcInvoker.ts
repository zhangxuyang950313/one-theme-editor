import { ipcRenderer, IpcRendererEvent } from "electron";
import { FILE_EVENT } from "src/common/enums";

import IPC_EVENT from "./ipc-event";

import type { TypeProjectData } from "src/types/project";
import type { TypeFileData } from "src/types/file-data";

export type TypeFileChangeCallbackData = {
  root: string;
  event: FILE_EVENT;
  src: string;
  data: TypeFileData;
};

class IpcInvoker {
  onFileChange = (callback: (data: TypeFileChangeCallbackData) => void) => {
    const cb = (
      $event: IpcRendererEvent,
      $data: TypeFileChangeCallbackData
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
export default Object.freeze(new IpcInvoker());
