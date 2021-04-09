import path from "path";
import { remote } from "electron";
import { TypeBrandInfo, TypeProjectData, TypeDatabase } from "@/types/project";
import Database from "nedb-promises";
import { isDev } from "./constant";

type TypeDbInstance = {
  project: Database;
};

const userDataPath = isDev
  ? path.resolve(remote.app.getAppPath(), "../userCache")
  : remote.app.getPath("userData");

const projectData = path.resolve(userDataPath, "store/projects.db");

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
  props: TypeProjectData
): Promise<TypeDatabase<TypeProjectData>> {
  return await db.project.insert(props);
}

// 获取所有工程
type TypeAllBrandProjects = {
  [x: string]: TypeProjectData[];
};
export async function getAllProjects(): Promise<
  TypeDatabase<TypeAllBrandProjects>[]
> {
  if (!db.project) return [];
  return await db.project.find<TypeAllBrandProjects>({});
}

// 获取对应厂商所有工程
export async function getProjectsByBrand(
  brandInfo: TypeBrandInfo
): Promise<TypeDatabase<TypeProjectData>[]> {
  if (!db.project) return [];
  const projects = await db.project.find<TypeProjectData>({ brandInfo });
  console.log(projects);
  return projects.sort((a, b) => {
    if (a.updatedAt && b.updatedAt) {
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    } else return 0;
  });
}

// db.project?.remove({}, { multi: true });
