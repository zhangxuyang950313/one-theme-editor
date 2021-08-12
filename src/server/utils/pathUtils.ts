import path from "path";
import os from "os";

const PATH = {
  // 静态资源目录
  STATIC_DIR: path.resolve(__dirname, "../static"),

  // 用户数据
  USER_DATA: path.resolve(__dirname, "../userData"),

  // 用户缓存
  get USER_CACHE(): string {
    return path.resolve(this.USER_DATA, "cache");
  },

  // 工程列表数据
  get PROJECTS_DB(): string {
    return path.resolve(this.USER_DATA, "projects");
  },

  // 图片缓存数据
  get IMAGE_DATA_DB(): string {
    return path.resolve(this.USER_DATA, "imageData");
  },

  // // 工程文件索引
  // export const PROJECT_INDEX = path.resolve(PROJECTS_DIR, "index");

  // 资源目录
  get RESOURCE_DIR(): string {
    return path.resolve(this.STATIC_DIR, "resource");
  },

  // 静态图片素材
  get ASSETS_DIR(): string {
    return path.resolve(this.STATIC_DIR, "assets");
  },

  // 二进制目录
  get BINARY_DIR(): string {
    return path.resolve(this.STATIC_DIR, "binary");
  },

  // 配置目录
  get SOURCE_CONFIG_DIR(): string {
    return path.resolve(this.RESOURCE_DIR, "sourceConfig");
  },

  // 模板总配置文件
  get SOURCE_CONFIG_FILE(): string {
    return path.resolve(this.SOURCE_CONFIG_DIR, "config.json");
  },

  get AAPT_TOOL(): string | null {
    const ns = {
      Linux: path.join("Linux", "aapt"),
      Darwin: path.join("Darwin", "aapt"),
      Windows_NT: path.join("Windows", "aapt.exe")
    }[os.type()];
    if (!ns) return null;
    return path.resolve(this.BINARY_DIR, ns);
  },

  get ADB_TOOL(): string | null {
    const ns = {
      Linux: path.join("Linux", "adb"),
      Darwin: path.join("Darwin", "adb"),
      Windows_NT: path.join("Windows", "adb.exe")
    }[os.type()];
    if (!ns) return null;
    return path.resolve(this.BINARY_DIR, ns);
  }
};
export default PATH;

export type TypePathConfig = typeof PATH;

export function resolveSourcePath(relative: string): string {
  return path.join(PATH.SOURCE_CONFIG_DIR, relative);
}

export function getSCDescriptionByNamespace(namespace: string): string {
  return path.join(PATH.SOURCE_CONFIG_DIR, namespace, "description.xml");
}
