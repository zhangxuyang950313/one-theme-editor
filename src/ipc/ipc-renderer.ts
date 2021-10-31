import { message } from "antd";
import {
  BrowserWindowConstructorOptions,
  ipcRenderer,
  IpcRendererEvent
} from "electron";
import { FILE_EVENT } from "src/enum";
import { TypeProjectDataDoc } from "src/types/project";
import { TypeWriteXmlTempPayload } from "src/types/request";
import {
  TypePageConfig,
  TypeResourceConfig,
  TypeResourceOption
} from "src/types/resource.config";
import { TypeFileData } from "src/types/resource.page";
import {
  TypeScenarioConfig,
  TypeScenarioOption
} from "src/types/scenario.config";
import IPC_EVENT from "./ipc-event";

ipcRenderer.setMaxListeners(9999);

type TypeReplyCB<T> = {
  success: (data: T) => void;
  fail?: (err: string) => void;
};

// 生成 ipcRenderer callback 调用
function generateIpcCallback<S, R>(event: IPC_EVENT) {
  return (data: S, callback?: TypeReplyCB<R>) => {
    ipcRenderer.on(event, ($event, $data) => {
      if ($data.type === "fail") callback?.fail && callback.fail($data.data);
      if ($data.type === "success") callback?.success($data.data);
    });
    ipcRenderer.send(event, data);
  };
}

// // 生成 ipcRenderer promise 调用
// function generateIpcPromise<S, R>(event: IPC_EVENT) {
//   return (data: S) => {
//     return new Promise<R>((success, fail) => {
//       generateIpcCallback<S, R>(event)(data, { success, fail });
//     });
//   };
// }

// 生成 ipcRenderer 同步调用
function generateIpcSync<S, R>(event: IPC_EVENT) {
  return (data?: S): R => ipcRenderer.sendSync(event, data);
}

function generateIpcInvoke<S, R>(event: IPC_EVENT) {
  return async (data: S): Promise<R> =>
    await ipcRenderer.invoke(event, data).catch(err => {
      console.log(err);
      throw new Error(err.message);
    });
}

const rendererIpc = {
  // 获取进程 id
  getPID: generateIpcSync<void, number>(IPC_EVENT.$getPID),

  // 获取场景选项列表
  getScenarioOptionList: generateIpcInvoke<void, TypeScenarioOption[]>(
    IPC_EVENT.$getScenarioOptionList
  ),

  // 获取场景配置
  getScenarioConfig: generateIpcInvoke<string, TypeScenarioConfig>(
    IPC_EVENT.$getScenarioConfig
  ),

  // 获取资源选项列表
  getResourceOptionList: generateIpcInvoke<string, TypeResourceOption[]>(
    IPC_EVENT.$getResourceOptionList
  ),

  // 获取资源配置
  getResourceConfig: generateIpcInvoke<string, TypeResourceConfig>(
    IPC_EVENT.$getResourceConfig
  ),

  // 获取页面配置列表
  getPageConfigList: generateIpcInvoke<
    { namespace: string; config: string },
    TypePageConfig
  >(IPC_EVENT.$getPageConfig),

  // 获取工程列表
  getProjectList: generateIpcInvoke<string, TypeProjectDataDoc[]>(
    IPC_EVENT.$getProjectList
  ),

  // 获取工程数据
  getProject: generateIpcInvoke<string, TypeProjectDataDoc>(
    IPC_EVENT.$getProject
  ),

  // 打开创建工程窗口
  createProject: generateIpcInvoke<string, TypeProjectDataDoc>(
    IPC_EVENT.$createProject
  ),

  // 更新工程信息
  updateProjectInfo: generateIpcInvoke<string, TypeProjectDataDoc>(
    IPC_EVENT.$updateProjectInfo
  ),

  // 打开工程编辑器
  openProjectEditor: generateIpcInvoke<string, void>(
    IPC_EVENT.$openProjectEditor
  ),

  // 打开启动页面
  openStarter: generateIpcInvoke<
    void | { windowOptions: BrowserWindowConstructorOptions },
    void
  >(IPC_EVENT.$openStarter),

  useFilesChange(
    callback: (data: {
      root: string;
      event: FILE_EVENT;
      src: string;
      data: TypeFileData;
    }) => void
  ): () => void {
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
  },

  getWatcherWatched: generateIpcSync<void, { [x: string]: string[] }>(
    IPC_EVENT.$getWatcherWatched
  ),

  // 拷贝文件
  copyFile: generateIpcInvoke<{ from: string; to: string }, void>(
    IPC_EVENT.$copyFile
  ),

  // 删除文件
  deleteFile: generateIpcInvoke<string, void>(IPC_EVENT.$deleteFile),

  // 写入 xml 文件
  writeXmlTemplate: generateIpcInvoke<
    TypeWriteXmlTempPayload,
    Record<string, string>
  >(IPC_EVENT.$writeXmlTemplate),

  // 获取文件数据
  getFileData: generateIpcInvoke<string, TypeFileData>(IPC_EVENT.$getFileData),

  // 同步获取文件数据
  getFileDataSync: generateIpcSync<string, TypeFileData>(
    IPC_EVENT.$getFileDataSync
  )
};

export default rendererIpc;
