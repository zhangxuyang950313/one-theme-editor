/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import fse from "fs-extra";
import {
  BrowserWindowConstructorOptions,
  ipcMain,
  ipcRenderer,
  remote
} from "electron";
import {
  createProject,
  findProjectByQuery,
  findProjectListByQuery
} from "main/dbHandler/project";
import PageConfigCompiler from "src/common/compiler/PageConfig";
import ResourceConfigCompiler from "src/common/compiler/ResourceConfig";
import ScenarioConfigCompiler from "src/common/compiler/ScenarioConfig";
import ScenarioOptionCompiler from "src/common/compiler/ScenarioOption";
import ERR_CODE from "src/common/errorCode";
import {
  TypeCreateProjectPayload,
  TypePackPayload,
  TypePackProcess,
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

// createWindows 方法内调用了 electron.app 获取路径方法，
// 需要在 electron 启动后才能调用，因为这里是渲染进程，
// 所以要检测是否已经加载窗口，然后异步加载
function createWindows() {
  // 使用闭包缓存，避免每次都加载
  let cw: typeof import("main/windows").createWindows;
  return {
    async get() {
      if (cw) return cw;
      // 处理边界情况：若未启动前调用，则等待 ready
      if (!remote.app.isReady()) {
        await new Promise(resolve => remote.app.on("ready", resolve));
      }
      cw = (await import("main/windows")).createWindows;
      return cw;
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
    server: async () => ScenarioOptionCompiler.def.getScenarioOptionList()
  });

  // 获取场景配置数据
  getScenarioConfig = this.createIpcAsync<string, TypeScenarioConfig>({
    event: IPC_EVENT.$getScenarioConfig,
    server: async scenarioSrc => {
      return ScenarioConfigCompiler.from(scenarioSrc).getConfig();
    }
  });

  // 获取资源配置列表
  getResourceConfigList = this.createIpcAsync<string[], TypeResourceConfig[]>({
    event: IPC_EVENT.$getResourceConfigList,
    server: async srcList => {
      return srcList.map(src => ResourceConfigCompiler.from(src).getConfig());
    }
  });

  // 获取资源配置
  getResourceConfig = this.createIpcAsync<string, TypeResourceConfig>({
    event: IPC_EVENT.$getResourceConfig,
    server: async resourceConfigSrc =>
      ResourceConfigCompiler.from(resourceConfigSrc).getConfig()
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
    TypeProjectDataDoc
  >({
    event: IPC_EVENT.$createProject,
    server: async data => await createProject(data)
  });

  // 获取工程列表
  findProjectListByQuery = this.createIpcAsync<
    Partial<TypeProjectDataDoc>,
    TypeProjectDataDoc[]
  >({
    event: IPC_EVENT.$getProjectList,
    server: async query => await findProjectListByQuery(query)
  });

  // 获取工程数据
  findProjectQuery = this.createIpcAsync<
    Partial<TypeProjectDataDoc>,
    TypeProjectDataDoc
  >({
    event: IPC_EVENT.$getProject,
    server: async query => await findProjectByQuery(query)
  });

  // 打开工程管理页
  openProjectManager = this.createIpcAsync<
    void | { windowOptions: BrowserWindowConstructorOptions },
    void
  >({
    event: IPC_EVENT.$openProjectManager,
    server: async () => {
      const cw = await createWindows().get();
      await cw.projectManager();
    }
  });

  // 启动工程编辑器
  openProjectEditorWindow = this.createIpcAsync<string, void>({
    event: IPC_EVENT.$openProjectEditor,
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
