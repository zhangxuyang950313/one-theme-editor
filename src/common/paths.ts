import path from "path";

// 静态资源目录
export const STATIC_DIR = path.resolve(__dirname, "../static");

// 用户数据
export const USER_DATA = path.resolve(__dirname, "../userData");

// 用户缓存
export const USER_CACHE = path.resolve(USER_DATA, "cache");

// 工程列表数据
export const PROJECTS_DB = path.resolve(USER_DATA, "projects");

// 图片缓存数据
export const IMAGE_DATA_DB = path.resolve(USER_DATA, "imageData");

// // 工程文件索引
// export const PROJECT_INDEX = path.resolve(PROJECTS_DIR, "index");

// 资源目录
export const RESOURCE_DIR = path.resolve(STATIC_DIR, "resource");

// 二进制目录
export const BINARY_DIR = path.resolve(RESOURCE_DIR, "binary");

// 配置目录
export const SOURCE_CONFIG_DIR = path.resolve(RESOURCE_DIR, "sourceConfig");

// 模板总配置文件
export const SOuRCE_CONFIG_FILE = path.resolve(
  SOURCE_CONFIG_DIR,
  "config.json"
);
