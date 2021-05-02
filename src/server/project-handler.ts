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

// 初始化项目
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
