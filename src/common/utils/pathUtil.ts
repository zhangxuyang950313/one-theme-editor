import os from "os";
import path from "path";
import { app, ipcRenderer, remote } from "electron";
import { TypePathCollection } from "src/types/config.extra";

// 区分主进程和渲染进程
const $app = !!ipcRenderer ? remote.app : app;

const pathUtil: TypePathCollection = {
  ELECTRON_LOCAL: $app.getLocale(),
  ELECTRON_TEMP: $app.getPath("temp"),
  ELECTRON_HOME: $app.getPath("home"),
  ELECTRON_DESKTOP: $app.getPath("desktop"),
  ELECTRON_CACHE: $app.getPath("cache"),
  ELECTRON_APP_DATA: $app.getPath("appData"),
  ELECTRON_DOCUMENTS: $app.getPath("documents"),
  ELECTRON_DOWNLOADS: $app.getPath("downloads"),
  ELECTRON_EXE: $app.getPath("exe"),
  ELECTRON_LOGS: $app.getPath("logs"),
  ELECTRON_APP_PATH: $app.getAppPath(),
  // 软件数据
  get CLIENT_DATA(): string {
    return path.resolve(this.ELECTRON_APP_PATH, "../appData");
  },
  // 静态资源目录
  get CLIENT_STATIC(): string {
    return path.resolve(this.ELECTRON_APP_PATH, "../static");
  },
  // 用户缓存
  get CLIENT_CACHE(): string {
    return path.resolve(this.CLIENT_DATA, "cache");
  },
  // 打包临时目录
  get PACK_TEMPORARY(): string {
    return path.join(this.CLIENT_DATA, "pack");
  },
  // 扩展数据存储
  get EXTRA_DATA_DB(): string {
    return path.resolve(this.CLIENT_DATA, "extra-data.nedb");
  },
  // 工程列表数据
  get PROJECTS_DB(): string {
    return path.resolve(this.CLIENT_DATA, "projects.nedb");
  },
  // 资源目录
  get RESOURCE_DIR(): string {
    return path.resolve(this.CLIENT_STATIC, "resource");
  },
  // 静态图片素材
  get ASSETS_DIR(): string {
    return path.resolve(this.CLIENT_STATIC, "assets");
  },
  // 二进制目录
  get BINARY_DIR(): string {
    return path.resolve(this.CLIENT_STATIC, "binary");
  },
  // 配置目录
  get RESOURCE_CONFIG_DIR(): string {
    return path.resolve(this.RESOURCE_DIR, "config");
  },
  // 模板总配置文件
  get RESOURCE_CONFIG_FILE(): string {
    return path.resolve(this.RESOURCE_CONFIG_DIR, "config.xml");
  },
  // aapt 工具
  get AAPT_TOOL(): string | null {
    const ns = {
      Linux: path.join("Linux", "aapt"),
      Darwin: path.join("Darwin", "aapt"),
      Windows_NT: path.join("Windows", "aapt.exe")
    }[os.type()];
    if (!ns) return null;
    return path.resolve(this.BINARY_DIR, ns);
  },
  // adb 工具
  get ADB_TOOL(): string | null {
    const ns = {
      Linux: path.join("Linux", "adb"),
      Darwin: path.join("Darwin", "adb"),
      Windows_NT: path.join("Windows", "adb.exe")
    }[os.type()];
    if (!ns) return null;
    return path.resolve(this.BINARY_DIR, ns);
  }
} as const;

export default pathUtil;

export function resolveResourceConfigPath(relative: string): string {
  return path.join(pathUtil.RESOURCE_CONFIG_DIR, relative);
}

export function resolveResourcePath(relative: string): string {
  return path.join($reactiveState.get("resourcePath"), relative);
}

export function resolveProjectPath(relative: string): string {
  return path.join($reactiveState.get("projectPath"), relative);
}

export function getSCDescriptionByNamespace(namespace: string): string {
  return path.join(pathUtil.RESOURCE_CONFIG_DIR, namespace, "description.xml");
}
