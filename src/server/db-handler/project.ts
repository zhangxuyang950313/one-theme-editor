import logSymbols from "log-symbols";
import { v4 as UUID } from "uuid";
import {
  TypeCreateProjectPayload,
  TypeProjectData,
  TypeProjectDataDoc
} from "types/project";
import { createNedb } from "server/utils/databaseUtil";
import pathUtil from "server/utils/pathUtil";
import SourceConfig from "server/compiler/SourceConfig";
import ERR_CODE from "common/errorCode";

// 频繁修改工程数据，常驻内存
console.debug(logSymbols.info, "工程数据库文件：", pathUtil.PROJECTS_DB);
const projectDB = createNedb(pathUtil.PROJECTS_DB);

// 创建工程
export async function createProject(
  data: TypeCreateProjectPayload
): Promise<TypeProjectDataDoc> {
  const { brandInfo, projectInfo, projectRoot, sourceConfigPath } = data;
  const uiVersion = new SourceConfig(sourceConfigPath).getUiVersion();
  return projectDB.insert<TypeProjectData>({
    uuid: UUID(),
    projectInfo,
    brandInfo,
    uiVersion,
    sourceConfigPath,
    projectRoot: projectRoot
  });
}

// brandType 筛选所有工程
export async function getProjectListOf(
  brandType: string
): Promise<TypeProjectDataDoc[]> {
  return projectDB
    .find<TypeProjectData>({ "brandInfo.type": brandType })
    .sort({ updatedAt: -1 });
}

// 查找工程
export async function findProjectByUUID(
  uuid: string
): Promise<TypeProjectDataDoc> {
  const project = await projectDB.findOne<TypeProjectData>({ uuid });
  if (!project) throw new Error(ERR_CODE[2001]);
  return project;
}

// 更新工程数据
export async function updateProject<
  T = Partial<TypeProjectData>,
  O = { [K in keyof T]: T[K] }
>(
  uuid: string,
  data:
    | T
    | { $push: O }
    | { $pull: O }
    | { $addToSet: O }
    | { $pop: O }
    | { $set: O }
    | { $unset: O }
): Promise<TypeProjectDataDoc> {
  const updated = await projectDB.update<TypeProjectData>({ uuid }, data, {
    multi: true, // 更新所有匹配项目
    upsert: true, // 不存在则创建
    returnUpdatedDocs: true
  });
  if (updated[0]) return updated[0];
  else throw new Error(ERR_CODE[2004]);
}
