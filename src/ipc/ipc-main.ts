import createWindows from "src/main/windows";
import {
  ipcMain,
  BrowserWindow,
  BrowserWindowConstructorOptions
} from "electron";
import {
  TypeScenarioConfig,
  TypeScenarioOption
} from "src/types/scenario.config";
import {
  TypePageConfig,
  TypeResourceConfig,
  TypeResourceOption
} from "src/types/resource.config";
import { TypeProjectDataDoc } from "src/types/project";
import {
  findProjectByQuery,
  getProjectListByMd5
} from "server/dbHandler/project";
import ScenarioConfigCompiler from "src/server/compiler/ScenarioConfig";
import ResourceConfigCompiler from "server/compiler/ResourceConfig";
import ScenarioOptions from "server/compiler/ScenarioOptions";
import PageConfigCompiler from "server/compiler/PageConfig";
import IPC_EVENT from "./ipc-event";

type TypeReply<T> /* 主进程答复 */ =
  | { type: "success"; data: T }
  | { type: "fail"; data: string };

// 生成 ipcMain 调用
function generateIpcCallback<S, R extends unknown>(
  event: IPC_EVENT,
  handler: (data: S) => Promise<R> | R
): void {
  ipcMain.on(event, async ($event, $data: S) => {
    try {
      const data = await handler($data);
      const reply: TypeReply<R> = { type: "success", data: data };
      $event.reply(event, reply);
    } catch (err: any) {
      const reply = { type: "fail", data: err.message };
      $event.reply(event, reply);
    }
  });
}

// 生成 ipcMain 同步调用
function generateIpcMainSync<S, R>(event: IPC_EVENT, handler: (data: S) => R) {
  ipcMain.on(event, ($event, $data: S) => {
    $event.returnValue = handler($data);
  });
}

// 生成 ipcMain handle 调用
function generateIpcHandle<S, R extends Promise<unknown>>(
  event: IPC_EVENT,
  handler: (data: S) => R
) {
  return ipcMain.handle(event, async ($event, $data: S) => handler($data));
}

const mainIpc = {
  // 注册服务
  registerServer(): void {
    generateIpcMainSync<void, number>(IPC_EVENT.$getPID, () => process.pid);

    // 获取场景选项列表
    generateIpcHandle<void, Promise<TypeScenarioOption[]>>(
      IPC_EVENT.$getScenarioOptionList,
      async () => ScenarioOptions.readScenarioOptionList()
    );

    // 获取场景配置数据
    generateIpcHandle<string, Promise<TypeScenarioConfig>>(
      IPC_EVENT.$getScenarioConfig,
      async scenarioSrc => ScenarioConfigCompiler.from(scenarioSrc).getConfig()
    );

    // 获取资源选项列表
    generateIpcHandle<string, Promise<TypeResourceOption[]>>(
      IPC_EVENT.$getResourceOptionList,
      async src => ScenarioConfigCompiler.from(src).getResourceOptionList()
    );

    // 获取资源配置
    generateIpcHandle<string, Promise<TypeResourceConfig>>(
      IPC_EVENT.$getResourceConfig,
      async src => ResourceConfigCompiler.from(src).getConfig()
    );

    // 获取页面配置列表
    generateIpcHandle<
      { namespace: string; config: string },
      Promise<TypePageConfig>
    >(IPC_EVENT.$getPageConfig, async data =>
      new PageConfigCompiler(data).getData()
    );

    // 获取工程列表
    generateIpcHandle<string, Promise<TypeProjectDataDoc[]>>(
      IPC_EVENT.$getProjectList,
      async scenarioMd5 => await getProjectListByMd5(scenarioMd5)
    );

    // 获取工程数据
    generateIpcHandle<string, Promise<TypeProjectDataDoc>>(
      IPC_EVENT.$getProject,
      async uuid => await findProjectByQuery({ uuid })
    );

    // 启动工程编辑器
    generateIpcHandle<string, Promise<void>>(
      IPC_EVENT.$openProjectEditor,
      async uuid => {
        await createWindows.projectEditor(uuid);
      }
    );

    // 打开启动页面
    generateIpcHandle<BrowserWindowConstructorOptions, Promise<void>>(
      IPC_EVENT.$openStarter,
      async () => {
        await createWindows.starter();
      }
    );

    // 打开创建工程窗口
    generateIpcHandle<string, Promise<void>>(
      IPC_EVENT.$createProject,
      async scenarioSrc => {
        await createWindows.createProject(scenarioSrc);
      }
    );
  }
};

export default mainIpc;
