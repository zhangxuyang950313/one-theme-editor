import path from "path";
import fse from "fs-extra";
import Nedb from "nedb-promises";
import { PROJECTS_DIR } from "common/paths";
import { getRandomStr } from "common/utils";
import {
  TypeDatabase,
  TypeCreateProjectData,
  TypeProjectData,
  TypeBrandInfo,
  TypeUiVersionInfo
} from "types/project";
import errCode from "renderer/core/error-code";
import ProjectData from "src/data/ProjectData";
import { compileTempInfo } from "./template";

function createNedb(filename: string) {
  fse.ensureDirSync(path.dirname(filename));
  return new Nedb({
    filename,
    autoload: true,
    timestampData: true
  });
}

// 创建索引，加速查找
const projectIndexFile = path.resolve(PROJECTS_DIR, "index");
fse.ensureFileSync(projectIndexFile);
const projectIndexDB = createNedb(projectIndexFile);
type TypeIndex = {
  filename: string;
  brandType: string;
};

// 创建工程
export async function createProject(
  data: TypeCreateProjectData
): Promise<TypeDatabase<TypeProjectData>> {
  const projects = fse.readdirSync(PROJECTS_DIR);
  let filename = getRandomStr();
  // 重名检测
  while (projects.includes(filename)) {
    filename = getRandomStr();
  }
  const file = path.resolve(PROJECTS_DIR, filename);
  const { brandConf, uiVersionConf } = data;
  const brandInfo: TypeBrandInfo = {
    type: brandConf.type,
    name: brandConf.name
  };
  const uiVersionInfo: TypeUiVersionInfo = {
    name: uiVersionConf.name,
    code: uiVersionConf.code
  };
  const templateInfo = await compileTempInfo(data);
  // 组装数据
  const projectData = new ProjectData();
  projectData.setProjectInfo(data.projectInfo);
  projectData.setBrandInfo(brandInfo);
  projectData.setUiVersionInfo(uiVersionInfo);
  projectData.setTemplateInfo(templateInfo);
  const project = await createNedb(file).insert(projectData.getData());
  // 添加索引
  projectIndexDB.insert({
    _id: project._id,
    filename,
    brandType: data.brandConf.type
  });
  return project;
}

// 获取所有工程
export async function getProjectList(
  brandType: string
): Promise<TypeDatabase<TypeCreateProjectData>[]> {
  const projectIndex = await projectIndexDB.find<TypeIndex>({ brandType });
  const projects = projectIndex.map(item => {
    const filename = path.resolve(PROJECTS_DIR, item.filename);
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
async function getProjectDB(_id: string): Promise<Nedb> {
  const data = await projectIndexDB.findOne<TypeIndex>({ _id });
  if (!data?.filename) throw new Error(errCode[2001]);
  return createNedb(path.join(PROJECTS_DIR, data.filename));
}

// 通过 _id 查找工程
export async function findProjectById(
  _id: string
): Promise<TypeDatabase<TypeCreateProjectData> | null> {
  return (await getProjectDB(_id)).findOne({ _id });
}

// 通过 _id 更新一个工程数据
export async function updateProject(
  _id: string,
  data: TypeCreateProjectData
): Promise<TypeDatabase<TypeCreateProjectData>> {
  const project = await getProjectDB(_id);
  return project.update({ _id }, data, { returnUpdatedDocs: true });
}
