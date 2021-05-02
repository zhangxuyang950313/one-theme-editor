import path from "path";
import fse from "fs-extra";
import Nedb from "nedb-promises";
import { PROJECTS_DIR } from "common/paths";
import { getRandomStr } from "common/utils";
import { TypeDatabase, TypeProjectThm } from "types/project";

function createNedb(filename: string) {
  fse.ensureDirSync(path.dirname(filename));
  return new Nedb({
    filename,
    autoload: true,
    timestampData: true
  });
}

// 初始化工程
export async function initProject(
  data: TypeProjectThm
): Promise<TypeDatabase<TypeProjectThm>> {
  const projects = fse.readdirSync(PROJECTS_DIR);
  let filename = getRandomStr();
  // 重名检测
  while (projects.includes(filename)) {
    filename = getRandomStr();
  }
  const file = path.resolve(PROJECTS_DIR, filename);
  const db = createNedb(file);
  return await db.insert(data);
}

// 获取所有工程
export async function getProjectList(): Promise<
  TypeDatabase<TypeProjectThm>[]
> {
  const projects = fse.readdirSync(PROJECTS_DIR).map(name => {
    const filename = path.resolve(PROJECTS_DIR, name);
    const projectDB = createNedb(filename);
    return projectDB.find<TypeProjectThm>({});
  });
  const projectList = await Promise.all(projects);
  return projectList
    .map(item => item[0])
    .filter(Boolean)
    .sort((a, b) => {
      if (a.updatedAt && b.updatedAt) {
        return b.updatedAt.getTime() - a.updatedAt.getTime();
      } else return 0;
    });
}
