/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import fse from "fs-extra";
import {
  BrowserWindowConstructorOptions,
  ipcMain,
  ipcRenderer
} from "electron";
import {
  createProject,
  findProjectByQuery,
  getProjectListByMd5
} from "main/dbHandler/project";
import PageConfigCompiler from "src/common/compiler/PageConfig";
import ResourceConfigCompiler from "src/common/compiler/ResourceConfig";
import ScenarioConfigCompiler from "src/common/compiler/ScenarioConfig";
import ScenarioOptions from "src/common/compiler/ScenarioOptions";
import ERR_CODE from "src/common/errorCode";
import {
  TypeCreateProjectPayload,
  TypePackPayload,
  TypePackProcess,
  TypeProjectData,
  TypeProjectDataDoc,
  TypeUnpackPayload
} from "src/types/project";
import { TypePageConfig, TypeResourceConfig } from "src/types/resource.config";
import {
  TypeScenarioConfig,
  TypeScenarioOption
} from "src/types/scenario.config";
import { TypeWriteXmlTempPayload } from "src/types/request";
import { writeXmlTemplate } from "src/common/xmlTemplate";
import { getFileData } from "src/common/utils";
import { TypeFileData } from "src/types/resource.page";
import PackageUtil from "src/common/utils/PackageUtil";
import IPC_EVENT from "./ipc-event";
import IpcCreator from "./IpcCreator";

if (ipcRenderer) ipcRenderer.setMaxListeners(9999);
if (ipcMain) ipcMain.setMaxListeners(9999);

function createWindows() {
  let cw: typeof import("main/windows").createWindows;
  return {
    async get() {
      if (cw) return cw;
      const { createWindows } = await import("main/windows");
      cw = createWindows;
      return createWindows;
    }
  };
}

class IpcServer extends IpcCreator {
  // 获取进程 id
  getPID = this.createIpcSync<void, number>({
    event: IPC_EVENT.$getPID,
    server: () => process.pid
  });

  // 获取场景选项列表
  getScenarioOptionList = this.createIpcAsync<void, TypeScenarioOption[]>({
    event: IPC_EVENT.$getScenarioOptionList,
    server: async () => ScenarioOptions.readScenarioOptionList()
  });

  // 获取场景选项
  getScenarioOption = this.createIpcAsync<string, TypeScenarioOption>({
    event: IPC_EVENT.$getScenarioOption,
    server: async scenarioSrc => ScenarioOptions.def.getOption(scenarioSrc)
  });
  // 获取场景配置数据
  getScenarioConfig = this.createIpcAsync<string, TypeScenarioConfig>({
    event: IPC_EVENT.$getScenarioConfig,
    server: async scenarioSrc =>
      ScenarioConfigCompiler.from(scenarioSrc).getConfig()
  });

  // 获取资源配置
  getResourceConfig = this.createIpcAsync<string, TypeResourceConfig>({
    event: IPC_EVENT.$getResourceConfig,
    server: async scenarioSrc =>
      ResourceConfigCompiler.from(scenarioSrc).getConfig()
  });

  // 获取页面配置列表
  getPageConfig = this.createIpcAsync<
    { namespace: string; config: string },
    TypePageConfig
  >({
    event: IPC_EVENT.$getPageConfig,
    server: async data => new PageConfigCompiler(data).getData()
  });

  // 创建工程
  createProject = this.createIpcAsync<
    TypeCreateProjectPayload,
    TypeProjectData
  >({
    event: IPC_EVENT.$createProject,
    server: async data => await createProject(data)
  });

  // 获取工程列表
  getProjectListByMd5 = this.createIpcAsync<string, TypeProjectDataDoc[]>({
    event: IPC_EVENT.$getProjectList,
    server: async scenarioMd5 => await getProjectListByMd5(scenarioMd5)
  });

  // 获取工程数据
  getProject = this.createIpcAsync<
    Partial<TypeProjectDataDoc>,
    TypeProjectDataDoc
  >({
    event: IPC_EVENT.$getProject,
    server: async query => await findProjectByQuery(query)
  });

  // 打开启动页面
  openStarter = this.createIpcAsync<
    void | { windowOptions: BrowserWindowConstructorOptions },
    void
  >({
    event: IPC_EVENT.$openStarter,
    server: async () => {
      const cw = await createWindows().get();
      await cw.starter();
    }
  });

  // 打开创建工程窗口
  openCreateProjectWindow = this.createIpcAsync<TypeScenarioOption, void>({
    event: IPC_EVENT.$openCreateProjectWindow,
    server: async scenarioOption => {
      const cw = await createWindows().get();
      await cw.createProject(scenarioOption);
    }
  });

  // 启动工程编辑器
  openProjectEditorWindow = this.createIpcAsync<string, void>({
    event: IPC_EVENT.$openProjectEditorWindow,
    server: async uuid => {
      const cw = await createWindows().get();
      await cw.projectEditor(uuid);
    }
  });

  // 拷贝文件
  copyFile = this.createIpcAsync<{ from: string; to: string }, void>({
    event: IPC_EVENT.$copyFile,
    server: ({ from, to }) => {
      if (!fse.existsSync(from)) {
        throw new Error(ERR_CODE[4003]);
      }
      return fse.copy(from, to);
    }
  });

  // 删除文件
  deleteFile = this.createIpcAsync<string, void>({
    event: IPC_EVENT.$deleteFile,
    server: file => {
      if (!fse.existsSync(file)) {
        throw new Error(ERR_CODE[4003]);
      }
      return fse.unlink(file);
    }
  });

  // 写入 xml 文件
  writeXmlTemplate = this.createIpcAsync<
    TypeWriteXmlTempPayload,
    Record<string, string>
  >({
    event: IPC_EVENT.$writeXmlTemplate,
    server: data => writeXmlTemplate(data)
  });

  // 获取文件数据
  getFileData = this.createIpcAsync<string, TypeFileData>({
    event: IPC_EVENT.$getFileData,
    server: async file => getFileData(file)
  });

  // 同步获取文件数据
  getFileDataSync = this.createIpcSync<string, TypeFileData>({
    event: IPC_EVENT.$getFileDataSync,
    server: getFileData
  });

  // 打包并导出
  packProject = this.createIpcCallback<TypePackPayload, TypePackProcess>({
    event: IPC_EVENT.$packProject,
    server: (params, callback) => {
      PackageUtil.pack(params, callback);
    }
  });

  // 解包
  unpackProject = this.createIpcCallback<TypeUnpackPayload, TypePackProcess>({
    event: IPC_EVENT.$unpackProject,
    server: (params, callback) => {
      PackageUtil.unpack(params, callback);
    }
  });

  // // 应用
  // apply = this.createIpcCallback({
  //   event: IPC_EVENT.$apply,
  //   server: () => {
  //     //
  //   }
  // })
}

export default new IpcServer();
