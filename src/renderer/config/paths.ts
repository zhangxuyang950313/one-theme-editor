import path from "path";
import { remote } from "electron";

// app 根目录
export const appDir = path.resolve(remote.app.getAppPath(), "..");

// 静态资源目录
export const staticDir = path.resolve(appDir, "static");

// 二进制文件目录
export const binaryDir = path.resolve(appDir, "binary");

// 主题资源目录
export const resourceDir = path.resolve(staticDir, "resource");

// 模板所在目录
export const templateDir = path.resolve(resourceDir, "templates");

// 手机品牌配置文件
export const templateConfigFile = path.resolve(templateDir, "config.xml");
