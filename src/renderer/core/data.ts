import path from "path";
import { remote } from "electron";
import { TypeProjectInfo } from "@/types/project";
import Nedb from "./nedb-promisify";

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

// 创建工程
export async function createProject(
  info: TypeProjectInfo
): Promise<TypeProjectInfo | null> {
  if (!db.projects) return Promise.resolve(null);
  return await db.projects.insert(info);
}

// 获取所有工程
export async function getProjects(): Promise<TypeProjectInfo[]> {
  if (!db.projects) return [];
  const projects = await db.projects.getAllData();
  return projects.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}
