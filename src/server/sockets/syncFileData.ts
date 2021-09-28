import SocketConfig from "src/common/socketConf";
import { FSWatcher } from "chokidar";
import { Socket } from "socket.io";
import { FILE_STATUS } from "src/enum";
import { getProjectFileData } from "server/services/project";
import { SocketInvoker } from "./util";

let watcher: FSWatcher | null = null;

// 同步文件数据
export default function syncFileData(socket: Socket): void {
  const { event, sendData, receiveData } = SocketConfig.syncFileContent;
  new SocketInvoker<typeof receiveData, typeof sendData>(socket)
    .event(event)
    .on(async (data, emit) => {
      if (!watcher) {
        watcher = new FSWatcher({ cwd: data.projectRoot });
      }
      const listener = (file: string, event: FILE_STATUS) => {
        const fileData = getProjectFileData(data.projectRoot, file);
        emit({ file, data: fileData });
      };
      watcher.on(FILE_STATUS.ADD, file => {
        listener(file, FILE_STATUS.ADD);
      });
      watcher.on(FILE_STATUS.CHANGE, file => {
        listener(file, FILE_STATUS.CHANGE);
      });
      watcher.on(FILE_STATUS.UNLINK, file => {
        listener(file, FILE_STATUS.UNLINK);
      });
      watcher.add(data.srcList);
    });
}

// 不同步文件数据
export function cancelSyncFileData(socket: Socket): void {
  const { event, sendData, receiveData } = SocketConfig.cancelSyncFileContent;
  new SocketInvoker<typeof receiveData, typeof sendData>(socket)
    .event(event)
    .on(async (data, emit) => {
      if (!watcher) return;
      watcher.unwatch(data.srcList);
      emit(null);
    });
}
