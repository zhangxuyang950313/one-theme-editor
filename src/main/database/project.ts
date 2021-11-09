import logSymbols from "log-symbols";
import { v4 as UUID } from "uuid";
import {
  TypeCreateProjectPayload,
  TypeProjectData,
  TypeProjectDataDoc
} from "src/types/project";
import { createNedb } from "src/common/utils/databaseUtil";
import ResourceConfigCompiler from "src/common/classes/ResourceConfigCompiler";
import pathUtil from "src/common/utils/pathUtil";
import ERR_CODE from "src/common/enums/ErrorCode";

// 频繁修改工程数据，常驻内存
console.debug(logSymbols.info, "工程数据库：", pathUtil.PROJECTS_DB);
const projectDB = createNedb(pathUtil.PROJECTS_DB);

// 创建工程
export async function createProject(
  data: TypeCreateProjectPayload
): Promise<TypeProjectDataDoc> {
  const { description, root, scenarioSrc, resourceSrc } = data;
  const uiVersion = ResourceConfigCompiler.from(resourceSrc).getUiVersion();
  return projectDB.insert<TypeProjectData>({
    uuid: UUID(),
    root,
    description,
    uiVersion,
    scenarioSrc,
    resourceSrc
  });
}

// 筛选工程
export async function findProjectListByQuery(
  query: Partial<TypeProjectDataDoc>
): Promise<TypeProjectDataDoc[]> {
  return projectDB.find<TypeProjectData>(query).sort({ updatedAt: -1 });
}

// 查找工程
export async function findProjectByQuery(
  query: Partial<TypeProjectDataDoc>
): Promise<TypeProjectDataDoc> {
  const project = await projectDB.findOne<TypeProjectData>(query);
  if (!project) throw new Error(ERR_CODE[2001]);
  return project;
}

// 更新工程数据
export async function updateProject<
  T extends Partial<TypeProjectData>,
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
    multi: false, // 更新所有匹配项目
    upsert: false, // 不存在则创建
    returnUpdatedDocs: true
  });
  if (updated) return updated;
  else throw new Error(ERR_CODE[2004]);
}