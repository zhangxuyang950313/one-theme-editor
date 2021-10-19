import { ipcRenderer } from "electron";
import { TypeProjectDataDoc } from "src/types/project";
import IPC_EVENT from "src/enum/ipc-event";
import { TypeScenarioOption } from "src/types/scenario.config";

export type TypeReply<T> /* 主进程答复 */ =
  | { type: "success"; data: T }
  | { type: "fail"; data: string };
type TypeReplyCB<T> = {
  success: (data: T) => void;
  fail?: (err: string) => void;
};
function replyCallback<T extends unknown, E = Electron.IpcRendererEvent>(
  callback?: TypeReplyCB<T>
) {
  return (event: E, $data: TypeReply<T>) => {
    if ($data.type === "fail") {
      callback?.fail && callback.fail($data.data);
    }
    if ($data.type === "success") {
      callback?.success($data.data);
    }
  };
}

const renderIpc = {
  /**
   * 创建工程子模态框
   */
  createProject(
    scenarioSrc: string,
    callback?: TypeReplyCB<TypeProjectDataDoc>
  ): void {
    ipcRenderer.on(
      IPC_EVENT.$createProject,
      replyCallback<TypeProjectDataDoc>(callback)
    );
    ipcRenderer.send(IPC_EVENT.$createProject, scenarioSrc);
  },

  /**
   * 更新工程子模态框
   */
  updateProjectInfo(
    uuid: string,
    callback?: TypeReplyCB<TypeProjectDataDoc>
  ): void {
    ipcRenderer.on(
      IPC_EVENT.$updateProjectInfo,
      replyCallback<TypeProjectDataDoc>(callback)
    );
    ipcRenderer.send(IPC_EVENT.$updateProjectInfo, uuid);
  },

  /**
   * 获取场景配置
   */
  getScenarioOption(
    src: string,
    callback?: TypeReplyCB<TypeScenarioOption>
  ): void {
    ipcRenderer.on(
      IPC_EVENT.$getScenarioOption,
      replyCallback<TypeScenarioOption>(callback)
    );
    ipcRenderer.send(IPC_EVENT.$getScenarioOption, src);
  }
};
export default renderIpc;
