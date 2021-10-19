import { BrowserWindowConstructorOptions, ipcRenderer } from "electron";
import { TypeProjectDataDoc } from "src/types/project";
import {
  TypePageConfig,
  TypeResourceConfig,
  TypeResourceOption
} from "src/types/resource.config";
import {
  TypeScenarioConfig,
  TypeScenarioOption
} from "src/types/scenario.config";
import IPC_EVENT from "./ipc-event";

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
  return async (data: S): Promise<R> => await ipcRenderer.invoke(event, data);
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
  openProjectEditor: generateIpcInvoke<
    { uuid: string; windowOptions?: BrowserWindowConstructorOptions },
    void
  >(IPC_EVENT.$openProjectEditor),

  // 打开启动页面
  openStarter: generateIpcInvoke<
    void | { windowOptions: BrowserWindowConstructorOptions },
    void
  >(IPC_EVENT.$openStarter)
};

export default rendererIpc;
