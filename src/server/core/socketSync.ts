import chokidar from "chokidar";
import { findProjectByUUID } from "server/db-handler/project";

/**
 *
 */
export enum FILE_STATUS {
  ADD = "add",
  CHANGE = "change",
  UNLINK = "unlink"
}
export async function watchFiles(
  uuid: string,
  list: string[],
  callback: (data: { event: FILE_STATUS; relativePath: string }) => void
): Promise<void> {
  const project = await findProjectByUUID(uuid);
  const watcher = new chokidar.FSWatcher({
    cwd: project.projectRoot
  });
  // 设定监听最大值
  // TODO：如果超过会是什么样
  watcher.setMaxListeners(100);
  watcher
    // 增加/重命名
    .on(FILE_STATUS.ADD, relativePath => {
      console.log(FILE_STATUS.ADD, relativePath);
      callback({ event: FILE_STATUS.ADD, relativePath });
    })
    // 变更
    .on(FILE_STATUS.CHANGE, relativePath => {
      console.log(FILE_STATUS.CHANGE, relativePath);
      callback({ event: FILE_STATUS.CHANGE, relativePath });
    })
    // 删除/移动/重命名
    .on(FILE_STATUS.UNLINK, relativePath => {
      console.log(FILE_STATUS.UNLINK, relativePath);
      callback({ event: FILE_STATUS.UNLINK, relativePath });
    })
    .add(list);
}
