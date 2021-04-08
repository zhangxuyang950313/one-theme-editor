import path from "path";
import { remote } from "electron";
import { TypeProjectInfo } from "@/types/project";
import Database from "nedb-promises";
// import Nedb from "./nedb-promisify";

export type TypeDbInstance = {
  project: Database;
};

const userDataPath = remote.app.getPath("userData");

const projectData = path.resolve(userDataPath, "store/projects.db");
// const templateData = path.resolve()

const db: TypeDbInstance = {
  // 项目工程数据
  project: new Database({
    filename: projectData,
    autoload: true,
    timestampData: true
  })
};

// 创建工程
export async function createProject(
  info: TypeProjectInfo
): Promise<TypeProjectInfo> {
  return await db.project.insert(info);
}

// 获取所有工程
export async function getProjects(): Promise<TypeProjectInfo[]> {
  if (!db.project) return [];
  const projects = await db.project.find<TypeProjectInfo>({});
  return projects.sort((a, b) => {
    if (a.updatedAt && b.updatedAt) {
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    } else return 0;
  });
}

// db.projects?.removeAll();
