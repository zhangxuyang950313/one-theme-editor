import os from "os";
import path from "path";

import fse from "fs-extra";
import { app } from "electron";

const isWorker = process.env.isWorker === "true";
const isRender = process.type === "renderer";
const isMain = process.type === "browser";
// const isRenderWorker = process.type === "worker";

// 区分主进程和渲染进程
// eslint-disable-next-line @typescript-eslint/no-var-requires
const $app: Electron.App = isRender ? require("@electron/remote").app : app;

const PathUtil = {
  ELECTRON_LOCAL: $app?.getLocale() || "",
  ELECTRON_TEMP: $app?.getPath("temp") || "",
  ELECTRON_HOME: $app?.getPath("home") || "",
  ELECTRON_DESKTOP: $app?.getPath("desktop") || "",
  ELECTRON_CACHE: $app?.getPath("cache") || "",
  ELECTRON_APP_DATA: $app?.getPath("appData") || "",
  ELECTRON_DOCUMENTS: $app?.getPath("documents") || "",
  ELECTRON_DOWNLOADS: $app?.getPath("downloads") || "",
  ELECTRON_EXE: $app?.getPath("exe") || "",
  ELECTRON_LOGS: $app?.getPath("logs") || "",
  /**
   * 开发环境 ${one-theme-editor}/release.main/
   * 打包后 release.main/
   */
  ELECTRON_APP_PATH: $app?.getAppPath() || "",
  /**
   * 将当前进程的根路径统一为 release.* 所在的目录
   */
  get ROOT_PATH(): string {
    if (isWorker || isMain) {
      return path.resolve(__dirname, "..");
    }
    if (isRender || $app?.isPackaged) {
      return this.ELECTRON_APP_PATH;
    }
    return __dirname;
  },
  // 软件数据
  get APP_DATA(): string {
    return path.resolve(this.ROOT_PATH, "app.data");
  },
  // 配置资源目录
  get RESOURCE(): string {
    return path.resolve(
      this.ROOT_PATH,
      $app?.isPackaged ? "app.resource" : "resource"
    );
  },
  // 静态资源目录
  get CLIENT_STATIC(): string {
    return path.resolve(this.ROOT_PATH, "static");
  },
  // 用户缓存
  get CLIENT_CACHE(): string {
    return path.resolve(this.APP_DATA, "cache");
  },
  // 打包临时目录
  get PACK_TEMPORARY(): string {
    return path.join(this.APP_DATA, "pack");
  },
  // .9 图缓存路径
  get NINEPATCH_TEMPORARY(): string {
    return path.join(this.APP_DATA, "9patch");
  },
  // 工程列表数据
  get PROJECTS_DB(): string {
    return path.resolve(this.APP_DATA, "projects.nedb");
  },
  // 缩略图
  get PROJECT_THUMBNAIL(): string {
    return path.resolve(this.APP_DATA, "thumbnail");
  },
  // 静态图片素材
  get ASSETS(): string {
    return path.resolve(this.CLIENT_STATIC, "assets");
  },
  // 二进制目录
  get BINARY(): string {
    return path.resolve(this.CLIENT_STATIC, "binary");
  },
  // 配置目录
  get RESOURCE_CONFIG(): string {
    return path.resolve(this.RESOURCE, "config");
  },
  // 模板总配置文件
  get RESOURCE_CONFIG_FILE(): string {
    return path.resolve(this.RESOURCE_CONFIG, "config.xml");
  },
  // aapt 工具
  get AAPT_TOOL(): string | null {
    const ns = {
      Linux: path.join("Linux", "aapt"),
      Darwin: path.join("Darwin", "aapt"),
      Windows_NT: path.join("Windows", "aapt.exe")
    }[os.type()];
    if (!ns) return null;
    return path.resolve(this.BINARY, ns);
  },
  // adb 工具
  get ADB_TOOL(): string | null {
    const ns = {
      Linux: path.join("Linux", "adb"),
      Darwin: path.join("Darwin", "adb"),
      Windows_NT: path.join("Windows", "adb.exe")
    }[os.type()];
    if (!ns) return null;
    return path.resolve(this.BINARY, ns);
  },
  get RELEASE_DIRS() {
    return {
      main: path.resolve(this.ROOT_PATH, "release.main"),
      workers: path.resolve(this.ROOT_PATH, "release.workers"),
      renderer: path.resolve(this.ROOT_PATH, "release.renderer")
    };
  },
  get WORKERS() {
    return {
      ninePatch: path.resolve(this.RELEASE_DIRS.workers, "nine-patch.js")
    };
  }
} as const;

export default Object.freeze(PathUtil);

export function resolveResourceConfigPath(relative: string): string {
  return path.join(PathUtil.RESOURCE_CONFIG, relative);
}

export function resolveResourcePath(relative: string): string {
  return path.join($one.$reactive.get("resourcePath"), relative);
}

export function resolveProjectPath(relative: string): string {
  return path.join($one.$reactive.get("projectPath"), relative);
}

export function getSCDescriptionByNamespace(namespace: string): string {
  return path.join(PathUtil.RESOURCE_CONFIG, namespace, "description.xml");
}

fse.ensureDirSync(PathUtil.APP_DATA);
fse.ensureDirSync(PathUtil.PACK_TEMPORARY);
fse.ensureDirSync(PathUtil.CLIENT_CACHE);
fse.ensureDirSync(PathUtil.PROJECT_THUMBNAIL);
fse.ensureDirSync(PathUtil.NINEPATCH_TEMPORARY);
