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
      $event.reply(event, {
        type: "success",
        data: data
      } as TypeReply<R>);
    } catch (err: any) {
      console.log(err);
      $event.reply(event, {
        type: "fail",
        data: err.message
      });
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
function generateIpcHandle<S, R>(
  event: IPC_EVENT,
  handler: (data: S) => Promise<R> | R
) {
  return ipcMain.handle(event, async ($event, $data: S) => {
    return await handler($data);
  });
}

const mainIpc = {
  // 监听打开创建工程窗口
  registerOpenCreateProject(win: BrowserWindow): void {
    generateIpcCallback<string, void>(IPC_EVENT.$createProject, scenarioSrc => {
      createWindows.createProject(win, scenarioSrc);
    });
  },
  // 注册服务
  registerServer(): void {
    generateIpcMainSync<void, number>(IPC_EVENT.$getPID, () => process.pid);

    // 获取场景选项列表
    generateIpcHandle<void, TypeScenarioOption[]>(
      IPC_EVENT.$getScenarioOptionList,
      () => ScenarioOptions.readScenarioOptionList()
    );

    // 获取场景配置数据
    generateIpcHandle<string, TypeScenarioConfig>(
      IPC_EVENT.$getScenarioConfig,
      scenarioSrc => ScenarioConfigCompiler.from(scenarioSrc).getConfig()
    );

    // 获取资源选项列表
    generateIpcHandle<string, TypeResourceOption[]>(
      IPC_EVENT.$getResourceOptionList,
      src => ScenarioConfigCompiler.from(src).getResourceOptionList()
    );

    // 获取资源配置
    generateIpcHandle<string, TypeResourceConfig>(
      IPC_EVENT.$getResourceConfig,
      src => ResourceConfigCompiler.from(src).getConfig()
    );

    // 获取页面配置列表
    generateIpcHandle<{ namespace: string; config: string }, TypePageConfig>(
      IPC_EVENT.$getPageConfig,
      data => new PageConfigCompiler(data).getData()
    );

    // 获取工程列表
    generateIpcHandle<string, TypeProjectDataDoc[]>(
      IPC_EVENT.$getProjectList,
      async scenarioMd5 => await getProjectListByMd5(scenarioMd5)
    );

    // 获取工程数据
    generateIpcHandle<string, TypeProjectDataDoc>(
      IPC_EVENT.$getProject,
      async uuid => await findProjectByQuery({ uuid })
    );

    // 启动工程编辑器
    generateIpcHandle<
      { uuid: string; windowOptions?: BrowserWindowConstructorOptions },
      void
    >(IPC_EVENT.$openProjectEditor, ({ uuid, windowOptions }) => {
      createWindows.projectEditor(uuid, windowOptions);
    });

    // 打开启动页面
    generateIpcHandle<BrowserWindowConstructorOptions, void>(
      IPC_EVENT.$openStarter,
      () => {
        createWindows.starter();
      }
    );
  }
};

export default mainIpc;
