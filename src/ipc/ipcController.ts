import path from "path";

import ChildProcess from "child_process";

import fse from "fs-extra";
import { ipcMain, ipcRenderer } from "electron";
import Adb, { Device } from "@devicefarmer/adbkit";

import PageConfigCompiler from "src/common/classes/PageConfigCompiler";
import ResourceConfigCompiler from "src/common/classes/ResourceConfigCompiler";
import ScenarioConfigCompiler from "src/common/classes/ScenarioConfigCompiler";
import ScenarioOptionCompiler from "src/common/classes/ScenarioOptionCompiler";
import ERR_CODE from "src/common/enums/ErrorCode";
import {
  TypeCreateProjectPayload,
  TypeProgressData,
  TypeProjectDataDoc
} from "src/types/project";
import {
  TypePackPayload,
  TypeUnpackPayload,
  TypeCompact9patchPayload,
  TypeExportPayload,
  TypeCopyPayload,
  TypeWriteXmlTempPayload
} from "src/types/ipc";
import { TypePageConfig, TypeResourceConfig } from "src/types/config.resource";
import {
  TypeScenarioConfig,
  TypeScenarioOption
} from "src/types/config.scenario";
import { TypeFileData } from "src/types/file-data";
import PackageUtil, { PackUtil } from "src/common/utils/PackageUtil";
import XmlTemplateUtil from "src/common/utils/XmlTemplateUtil";
import PathUtil from "src/common/utils/PathUtil";
import {
  chunkCreateWindow,
  chunkDirWatcher,
  chunkFileCache,
  chunkProjectDB
} from "src/common/asyncChunk";
import { TypeWatchedRecord } from "src/common/classes/DirWatcher";
import { fileDataCache } from "src/main/singletons/fileCache";

import { compactNinePatch } from "src/common/utils/NinePatchUtil";

import IPC_EVENT from "./ipc-event";
import ipcCreator from "./IpcCreator";

if (ipcRenderer) ipcRenderer.setMaxListeners(9999);
if (ipcMain) ipcMain.setMaxListeners(9999);

const adbClient = Adb.createClient();

class IpcController extends ipcCreator {
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
    server: async resourceConfigSrc => {
      return ResourceConfigCompiler.from(resourceConfigSrc).getConfig();
    }
  });

  // 获取页面配置列表
  getPageConfig = this
    /**/ .createIpcAsync<{ namespace: string; config: string }, TypePageConfig>(
      {
        event: IPC_EVENT.$getPageConfig,
        server: async data => new PageConfigCompiler(data).getData()
      }
    );

  // 创建工程
  createProject = this
    /**/ .createIpcAsync<TypeCreateProjectPayload, TypeProjectDataDoc>({
      event: IPC_EVENT.$createProject,
      server: async data => {
        const projectDB = await chunkProjectDB();
        const project = await projectDB.createProject(data);
        const preview = ResourceConfigCompiler.from(
          data.resourceSrc
        ).getPreviewAbsFile();
        if (fse.existsSync(preview)) {
          const target = path.join(
            PathUtil.PROJECT_THUMBNAIL_DIR,
            project.uuid
          );
          fse.copyFile(preview, target);
        }
        return project;
      }
    });

  updateProject = this.createIpcAsync<
    { uuid: string; data: TypeProjectDataDoc },
    TypeProjectDataDoc
  >({
    event: IPC_EVENT.$updateProject,
    server: async ({ uuid, data }) => {
      const projectDB = await chunkProjectDB();
      return projectDB.updateProject<TypeProjectDataDoc>(uuid, data);
    }
  });

  // 获取工程列表
  findProjectListByQuery = this
    /**/ .createIpcAsync<Partial<TypeProjectDataDoc>, TypeProjectDataDoc[]>({
      event: IPC_EVENT.$getProjectList,
      server: async query => {
        const projectDB = await chunkProjectDB();
        const list = await projectDB.findProjectListByQuery(query);
        // 若不存在缩略图，调用配置的预览图
        // TODO：需要补充配置也没有预览图的情况的默认图
        list.forEach(item => {
          const preview = ResourceConfigCompiler.from(
            item.resourceSrc
          ).getPreviewAbsFile();
          const th = path.join(PathUtil.PROJECT_THUMBNAIL_DIR, item.uuid);
          if (!fse.existsSync(th) && fse.existsSync(preview)) {
            fse.copySync(preview, th);
          }
        });
        return list;
      }
    });

  // 获取工程数据
  findProjectQuery = this
    /**/ .createIpcAsync<Partial<TypeProjectDataDoc>, TypeProjectDataDoc>({
      event: IPC_EVENT.$getProject,
      server: async query => {
        const projectDB = await chunkProjectDB();
        return await projectDB.findProjectByQuery(query);
      }
    });

  // // 设置配置预览图到预览图库
  // patchProjectPreview = this
  //   /**/ .createIpcAsync<TypePreviewData, TypePreviewDataDoc>({
  //     event: IPC_EVENT.$patchPreview,
  //     server: async uuid => {}
  //   });

  // 打开工程管理页
  openProjectManager = this.createIpcAsync<void, void>({
    event: IPC_EVENT.$openProjectManager,
    server: async () => {
      const createWindow = await chunkCreateWindow();
      await createWindow.projectManager();
    }
  });

  // 启动工程编辑器
  openProjectEditorWindow = this.createIpcAsync<string, void>({
    event: IPC_EVENT.$openProjectEditor,
    server: async uuid => {
      const createWindow = await chunkCreateWindow();
      await createWindow.projectEditor(uuid);
    }
  });

  getWatchedMapper = this.createIpcAsync<void, TypeWatchedRecord>({
    event: IPC_EVENT.$getWatchedMapper,
    server: async () => {
      const dirWatcher = await chunkDirWatcher();
      return dirWatcher.getWatchedRecord();
    }
  });

  // 拷贝文件/文件夹
  copyFile = this.createIpcAsync<TypeCopyPayload, void>({
    event: IPC_EVENT.$copyFile,
    server: ({ from, to, options }) => {
      if (!fse.existsSync(from)) {
        throw new Error(ERR_CODE[4003]);
      }
      return fse.copy(from, to, options);
    }
  });

  // 删除文件/文件夹
  deleteFile = this.createIpcAsync<string, void>({
    event: IPC_EVENT.$deleteFile,
    server: file => {
      if (!fse.existsSync(file)) {
        throw new Error(ERR_CODE[4003]);
      }
      return fse.remove(file);
    }
  });

  // 写入 xml 文件
  writeXmlTemplate = this
    /**/ .createIpcAsync<TypeWriteXmlTempPayload, Record<string, string>>({
      event: IPC_EVENT.$writeXmlTemplate,
      server: data => XmlTemplateUtil.writeXmlTemplate(data)
    });

  // 获取文件数据
  getFileData = this.createIpcAsync<string, TypeFileData>({
    event: IPC_EVENT.$getFileData,
    server: async file => {
      const fileDataCache = await chunkFileCache();
      return fileDataCache.get(file);
    }
  });

  // 同步获取文件数据
  getFileDataSync = this.createIpcSync<string, TypeFileData>({
    event: IPC_EVENT.$getFileDataSync,
    server: file => fileDataCache.get(file)
  });

  // 解包
  unpackProject = this.createIpcCallback<TypeUnpackPayload, TypeProgressData>({
    event: IPC_EVENT.$unpackProject,
    server: (params, callback) => {
      PackageUtil.unpack(params, callback);
    }
  });

  // 批量处理 .9 信息
  compact9patchBatch = this.createIpcAsync<TypeCompact9patchPayload, string>({
    event: IPC_EVENT.$compact9patchBatch,
    server: async data => {
      let to = data.to;
      if (!to) {
        // 临时目录
        to = path.join(PathUtil.PACK_TEMPORARY, path.basename(data.from));
      }
      // 若目录存在则删掉
      if (fse.existsSync(to)) {
        fse.removeSync(to);
      }
      await compactNinePatch(data.from, to);
      return to;
    }
  });

  // 打包工程，返回 buffer
  packProject = this.createIpcAsync<TypePackPayload, Buffer>({
    event: IPC_EVENT.$packProject,
    server: data => {
      return PackUtil.zipByRules(
        data.packDir,
        data.packConfig.items,
        data.packConfig.excludes
      );
    }
  });

  // 导出工程，打包并输出到文件
  exportProject = this.createIpcAsync<TypeExportPayload, string>({
    event: IPC_EVENT.$exportProject,
    server: async data => {
      const buffer = await PackUtil.zipByRules(
        data.packDir,
        data.packConfig.items,
        data.packConfig.excludes
      );
      // 确保输出目录存在
      fse.ensureDirSync(path.dirname(data.outputFile));
      // 写入文件
      fse.outputFileSync(data.outputFile, buffer);
      return data.outputFile;
    }
  });

  // 获取设备列表
  getDeviceList = this.createIpcAsync<void, Device[]>({
    event: IPC_EVENT.$getDeviceList,
    server: () => adbClient.listDevices()
  });

  // 运行 shell 脚本
  shellExec = this.createIpcAsync<string, string>({
    event: IPC_EVENT.$shell,
    server: async command => {
      return new Promise((resolve, reject) => {
        ChildProcess.exec(command, (error, stdout, stderr) => {
          if (error || stderr) {
            reject(error || stderr);
          }
          resolve(stdout.toString());
        });
      });
    }
  });
}

export default Object.freeze(new IpcController());
