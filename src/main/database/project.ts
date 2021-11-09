import { v4 as UUID } from "uuid";
import {
  TypeCreateProjectPayload,
  TypeProjectData,
  TypeProjectDataDoc
} from "src/types/project";
import ResourceConfigCompiler from "src/common/classes/ResourceConfigCompiler";
import PathUtil from "src/common/utils/PathUtil";
import ERR_CODE from "src/common/enums/ErrorCode";
import LogUtil from "src/common/utils/LogUtil";
import Database from "src/common/classes/Database";

console.log(process.pid, ":project");

class ProjectDatabase extends Database {
  constructor() {
    LogUtil.database("project", PathUtil.PROJECTS_DB);
    super(PathUtil.PROJECTS_DB);
  }

  // 创建工程
  async createProject(
    data: TypeCreateProjectPayload
  ): Promise<TypeProjectDataDoc> {
    const { description, root, scenarioSrc, resourceSrc } = data;
    const uiVersion = ResourceConfigCompiler.from(resourceSrc).getUiVersion();
    return super.insert<TypeProjectData>({
      uuid: UUID(),
      root,
      description,
      uiVersion,
      scenarioSrc,
      resourceSrc
    });
  }

  // 筛选工程
  async findProjectListByQuery(
    query: Partial<TypeProjectDataDoc>
  ): Promise<TypeProjectDataDoc[]> {
    return super.find<TypeProjectData>(query).sort({ updatedAt: -1 });
  }

  // 查找工程
  async findProjectByQuery(
    query: Partial<TypeProjectDataDoc>
  ): Promise<TypeProjectDataDoc> {
    const project = await super.findOne<TypeProjectData>(query);
    if (!project) throw new Error(ERR_CODE[2001]);
    return project;
  }

  // 更新工程数据
  async updateProject<
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
    const updated = await super.update<TypeProjectData>({ uuid }, data, {
      multi: false, // 更新所有匹配项目
      upsert: false, // 不存在则创建
      returnUpdatedDocs: true
    });
    if (updated) return updated;
    else throw new Error(ERR_CODE[2004]);
  }
}

export default new ProjectDatabase();
