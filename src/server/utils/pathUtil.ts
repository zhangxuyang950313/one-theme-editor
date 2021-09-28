import path from "path";
import os from "os";
import { TypeServerPath } from "src/types/extraConfig";

/**
 * 这些路径是基于 __dirname 的相对路径，调用前请确保你的执行路径
 * 目前只是在 server 模块中使用
 */
const paths: TypeServerPath = {
  // 软件数据
  CLIENT_DATA: path.resolve(__dirname, "../appData"),
  // 静态资源目录
  CLIENT_STATIC: path.resolve(__dirname, "../static"),
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
  get SOURCE_CONFIG_DIR(): string {
    return path.resolve(this.RESOURCE_DIR, "sourceConfig");
  },
  // 模板总配置文件
  get SOURCE_CONFIG_FILE(): string {
    return path.resolve(this.SOURCE_CONFIG_DIR, "config.xml");
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
export default paths;

export function resolveSourcePath(relative: string): string {
  return path.join(paths.SOURCE_CONFIG_DIR, relative);
}

export function getSCDescriptionByNamespace(namespace: string): string {
  return path.join(paths.SOURCE_CONFIG_DIR, namespace, "description.xml");
}
