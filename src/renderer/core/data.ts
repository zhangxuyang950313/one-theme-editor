import path from "path";
import { remote } from "electron";
import Nedb from "./nedb-promisify";

export type TypeProjectInfo = {
  name: string;
  description: string;
  uiVersion: string;
  author: string;
  designer: string;
};

export type TypeDbInstance = {
  projects: Nedb<TypeProjectInfo> | null;
};

const userDataPath = remote.app.getPath("userData");

const db: TypeDbInstance = {
  // 项目工程数据
  projects: new Nedb<TypeProjectInfo>({
    filename: path.resolve(userDataPath, "store/projects.db"),
    autoload: true,
    timestampData: true
  })
};

// 添加工程
export async function addProject(
  info: TypeProjectInfo
): Promise<TypeProjectInfo | null> {
  if (!db.projects) return Promise.resolve(null);
  return await db.projects.insert(info);
}

// 获取所有工程
export async function getProjects(): Promise<TypeProjectInfo[]> {
  if (!db.projects) return [];
  return await db.projects.getAllData();
}
