import path from "path";
import fse from "fs-extra";
import * as uuid from "uuid";
import Nedb from "nedb-promises";
import { PROJECTS_DIR, PROJECT_INDEX } from "common/paths";
import {
  TypeDatabase,
  TypeCreateProjectData,
  TypeProjectData
} from "types/project";
import errCode from "renderer/core/error-code";
import ProjectData from "src/data/ProjectData";
import { compileTempInfo } from "./template";

// TODO: 创建数据库有个坑，如果 filename 文件内容不是 nedb 能接受的数据格式则会导致服务崩溃
function createNedb(filename: string) {
  fse.ensureDirSync(path.dirname(filename));
  return new Nedb({
    filename,
    autoload: true,
    timestampData: true
  });
}

// 创建索引，加速查找
type TypeIndex = {
  uuid: string;
  brandType: string;
};
const projectIndexDB = createNedb(PROJECT_INDEX);
rebuildIndex();

// 重建索引
async function rebuildIndex() {
  fse.ensureDirSync(PROJECTS_DIR);
  const projectFiles = fse
    .readdirSync(PROJECTS_DIR)
    .filter(o => o !== "index") // 排除 index
    .map(o => path.resolve(PROJECTS_DIR, o)) // 补全路径
    .filter(o => fse.existsSync(o)); // 排除不在的路径
  projectFiles.forEach(async file => {
    const project = await createNedb(file).findOne<TypeProjectData>({});
    const count = await projectIndexDB.count({ uuid: project.uuid });
    if (count === 0) {
      projectIndexDB.insert<TypeIndex>({
        uuid: project.uuid,
        brandType: project.brand.type
      });
      console.log(`$重建索引: "${project.uuid}"]`);
    }
  });
}

// 创建工程
export async function createProject(
  data: TypeCreateProjectData
): Promise<TypeDatabase<TypeProjectData>> {
  fse.ensureDirSync(PROJECTS_DIR);
  const projects = fse.readdirSync(PROJECTS_DIR);
  let filename = uuid.v4();
  // 重名检测
  while (projects.includes(filename)) {
    filename = uuid.v4();
  }
  const file = path.resolve(PROJECTS_DIR, filename);
  const template = await compileTempInfo(data);
  // 组装数据
  const projectData = new ProjectData();
  projectData.setProjectInfo(data.projectInfo);
  projectData.setUuid(filename);
  projectData.setBrand({
    type: data.brandConf.type,
    name: data.brandConf.name
  });
  projectData.setUiVersion({
    name: data.uiVersionConf.name,
    code: data.uiVersionConf.code
  });
  projectData.setTemplate(template);
  const project = await createNedb(file).insert(projectData.getData());
  // 添加索引
  await projectIndexDB.insert<TypeIndex>({
    uuid: filename,
    brandType: data.brandConf.type
  });
  rebuildIndex();
  return project;
}

// 获取所有工程
export async function getProjectList(
  brandType: string
): Promise<TypeDatabase<TypeCreateProjectData>[]> {
  const projectIndex = await projectIndexDB.find<TypeIndex>({ brandType });
  const projects = projectIndex.map(item => {
    const filename = path.resolve(PROJECTS_DIR, item.uuid);
    const projectDB = createNedb(filename);
    return projectDB.findOne<TypeCreateProjectData>({});
  });
  const projectList = await Promise.all(projects);
  return projectList
    .filter(Boolean)
    .sort((a, b) =>
      a.updatedAt && b.updatedAt
        ? b.updatedAt.getTime() - a.updatedAt.getTime()
        : 0
    );
}

// 通过 _id 获取工程数据库实例
async function getProjectDB(uuid: string): Promise<Nedb> {
  const data = await projectIndexDB.findOne<TypeIndex>({ uuid });
  if (!data?.uuid) throw new Error(errCode[2001]);
  return createNedb(path.join(PROJECTS_DIR, data.uuid));
}

// 通过 uuid 查找工程
export async function findProjectByUUID(
  uuid: string
): Promise<TypeDatabase<TypeCreateProjectData> | null> {
  return (await getProjectDB(uuid)).findOne({ uuid });
}

// 通过 uuid 更新一个工程数据
export async function updateProject(
  uuid: string,
  data: TypeCreateProjectData
): Promise<TypeDatabase<TypeCreateProjectData>> {
  const projectDB = await getProjectDB(uuid);
  const updatedData = projectDB.update<TypeCreateProjectData>({ uuid }, data, {
    returnUpdatedDocs: true
  });
  if (!updatedData) throw new Error(errCode[2004]);
  return updatedData;
}
