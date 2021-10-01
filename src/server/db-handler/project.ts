import logSymbols from "log-symbols";
import { v4 as UUID } from "uuid";
import {
  TypeCreateProjectPayload,
  TypeProjectData,
  TypeProjectDataDoc
} from "src/types/project";
import { TypeScenarioConf } from "src/types/resource";
import { createNedb } from "server/utils/databaseUtil";
import pathUtil from "server/utils/pathUtil";
import ResourceConfig from "server/compiler/ResourceConfig";
import ERR_CODE from "src/common/errorCode";

// 频繁修改工程数据，常驻内存
console.debug(logSymbols.info, "工程数据库文件：", pathUtil.PROJECTS_DB);
const projectDB = createNedb(pathUtil.PROJECTS_DB);

// 创建工程
export async function createProject(
  data: TypeCreateProjectPayload
): Promise<TypeProjectDataDoc> {
  const { scenarioConfig, projectInfo, projectRoot, resourceConfigPath } = data;
  const uiVersion = new ResourceConfig(resourceConfigPath).getUiVersion();
  return projectDB.insert<TypeProjectData>({
    uuid: UUID(),
    projectInfo,
    scenarioConfig,
    uiVersion,
    resourceConfigPath: resourceConfigPath,
    projectRoot
  });
}

// md5 筛选所有工程
export async function getProjectListByMd5(
  md5: string
): Promise<TypeProjectDataDoc[]> {
  const findKey: `scenarioConfig.${keyof TypeScenarioConf}` =
    "scenarioConfig.md5";
  return projectDB
    .find<TypeProjectData>({ [findKey]: md5 })
    .sort({ updatedAt: -1 });
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
  const updated = await projectDB.update<TypeProjectData>(
    { uuid },
    { projectInfo: data },
    {
      multi: false, // 更新所有匹配项目
      upsert: false, // 不存在则创建
      returnUpdatedDocs: true
    }
  );
  console.log({ updated });
  if (updated) return updated;
  else throw new Error(ERR_CODE[2004]);
}
