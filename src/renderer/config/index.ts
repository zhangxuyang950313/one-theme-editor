import fs from "fs";
import path from "path";
import { remote } from "electron";
import { TypeBrandInfo } from "@/types/project";

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

// 模板描述文件列表
export const templateDescriptionList = fs
  .readdirSync(templateDir)
  .map(dir => path.resolve(templateDir, dir, "description.xml"))
  .filter(fs.existsSync); // 排除不存在 description.xml 的目录

// 品牌配置
export const brandConfig: TypeBrandInfo[] = [
  {
    key: "xm",
    name: "小米"
  }
  // {
  //   key: "hw",
  //   name: "华为"
  // },
  // {
  //   key: "oppp",
  //   name: "oppp"
  // },
  // {
  //   key: "vivo",
  //   name: "vivo"
  // }
];
