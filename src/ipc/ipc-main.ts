import fse from "fs-extra";
import createWindows from "src/main/windows";
import { ipcMain, BrowserWindowConstructorOptions } from "electron";
import {
  TypeScenarioConfig,
  TypeScenarioOption
} from "src/types/scenario.config";
import {
  TypePageConfig,
  TypeResourceConfig,
  TypeResourceOption
} from "src/types/resource.config";
import {
  TypeCreateProjectPayload,
  TypeProjectDataDoc
} from "src/types/project";
import {
  createProject,
  findProjectByQuery,
  getProjectListByMd5
} from "server/dbHandler/project";
import ScenarioConfigCompiler from "src/server/compiler/ScenarioConfig";
import ResourceConfigCompiler from "server/compiler/ResourceConfig";
import ScenarioOptions from "server/compiler/ScenarioOptions";
import PageConfigCompiler from "server/compiler/PageConfig";
import ERR_CODE from "src/constant/errorCode";
import { TypeWriteXmlTempPayload } from "src/types/request";
import { writeXmlTemplate } from "server/services/xmlTemplate";
import { TypeFileData } from "src/types/resource.page";
import { getFileData } from "src/common/utils";
import IPC_EVENT from "./ipc-event";

ipcMain.setMaxListeners(9999);

export type TypeMainReply<T> /* 主进程答复 */ =
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
      const reply: TypeMainReply<R> = { type: "success", data: data };
      $event.reply(event, reply);
    } catch (err: any) {
      const reply: TypeMainReply<R> = { type: "fail", data: err.message };
      $event.reply(event, reply);
    }
  });
}

// 生成 ipcMain 同步调用
function generateIpcSync<S, R>(event: IPC_EVENT, handler: (data: S) => R) {
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
    generateIpcSync<void, number>(IPC_EVENT.$getPID, () => process.pid);

    // 获取场景选项列表
    generateIpcHandle<void, Promise<TypeScenarioOption[]>>(
      IPC_EVENT.$getScenarioOptionList,
      async () => ScenarioOptions.readScenarioOptionList()
    );

    // 获取场景选项
    generateIpcHandle<string, Promise<TypeScenarioOption>>(
      IPC_EVENT.$getScenarioOption,
      async scenarioSrc => ScenarioOptions.def.getOption(scenarioSrc)
    );

    // 获取场景配置数据
    generateIpcHandle<string, Promise<TypeScenarioConfig>>(
      IPC_EVENT.$getScenarioConfig,
      async scenarioSrc => ScenarioConfigCompiler.from(scenarioSrc).getConfig()
    );

    // 获取资源选项列表
    generateIpcHandle<string, Promise<TypeResourceOption[]>>(
      IPC_EVENT.$getResourceOptionList,
      async scenarioSrc =>
        ScenarioConfigCompiler.from(scenarioSrc).getResourceOptionList()
    );

    // 获取资源配置
    generateIpcHandle<string, Promise<TypeResourceConfig>>(
      IPC_EVENT.$getResourceConfig,
      async scenarioSrc => ResourceConfigCompiler.from(scenarioSrc).getConfig()
    );

    // 获取页面配置列表
    generateIpcHandle<
      { namespace: string; config: string },
      Promise<TypePageConfig>
    >(IPC_EVENT.$getPageConfig, async data =>
      new PageConfigCompiler(data).getData()
    );

    // 创建工程
    generateIpcHandle<TypeCreateProjectPayload, Promise<TypeProjectDataDoc>>(
      IPC_EVENT.$createProject,
      async data => await createProject(data)
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

    // 打开启动页面
    generateIpcHandle<BrowserWindowConstructorOptions, Promise<void>>(
      IPC_EVENT.$openStarter,
      async () => {
        await createWindows.starter();
      }
    );

    // 打开创建工程窗口
    generateIpcHandle<TypeScenarioOption, Promise<void>>(
      IPC_EVENT.$openCreateProjectWindow,
      async scenarioOption => {
        await createWindows.createProject(scenarioOption);
      }
    );

    // 启动工程编辑器
    generateIpcHandle<string, Promise<void>>(
      IPC_EVENT.$openProjectEditorWindow,
      async uuid => {
        await createWindows.projectEditor(uuid);
      }
    );

    // 拷贝文件
    generateIpcHandle<{ from: string; to: string }, Promise<void>>(
      IPC_EVENT.$copyFile,
      ({ from, to }) => {
        if (!fse.existsSync(from)) {
          throw new Error(ERR_CODE[4003]);
        }
        return fse.copy(from, to);
      }
    );

    // 删除文件
    generateIpcHandle<string, Promise<void>>(IPC_EVENT.$deleteFile, file => {
      if (!fse.existsSync(file)) {
        throw new Error(ERR_CODE[4003]);
      }
      return fse.unlink(file);
    });

    // 写入 xml 文件
    generateIpcHandle<TypeWriteXmlTempPayload, Promise<Record<string, string>>>(
      IPC_EVENT.$writeXmlTemplate,
      data => writeXmlTemplate(data)
    );

    // 获取文件数据
    generateIpcHandle<string, Promise<TypeFileData>>(
      IPC_EVENT.$getFileData,
      async file => getFileData(file)
    );

    // 同步获取文件数据
    generateIpcSync<string, TypeFileData>(
      IPC_EVENT.$getFileDataSync,
      getFileData
    );
  }
};

export default mainIpc;
