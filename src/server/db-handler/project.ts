import path from "path";
import fse from "fs-extra";
import { v4 as UUID } from "uuid";
import Nedb from "nedb-promises";

import { PROJECTS_DB } from "server/core/paths";
import {
  TypeCreateProjectPayload,
  TypeImageMapper,
  TypeProjectData,
  TypeProjectDataDoc
} from "types/project";

import SourceConfig from "server/data/SourceConfig";
import ERR_CODE from "renderer/core/error-code";

// TODO: 创建数据库有个坑，如果 filename 文件内容不是 nedb 能接受的数据格式则会导致服务崩溃
function createNedb(filename: string) {
  fse.ensureDirSync(path.dirname(filename));
  return new Nedb({
    filename,
    autoload: true,
    timestampData: true
  });
}

// 频繁修改工程数据，常驻内存
const projectDB = createNedb(PROJECTS_DB);

// // 把 imageMapper 内容同步到本地
// export async function imageMapperSyncToLocal(
//   uuid: string
// ): Promise<Promise<(() => void) | void>[]> {
//   return projectDB
//     .findOne<TypeProjectDataDoc>({ uuid })
//     .then(project => {
//       const { imageMapperList, projectRoot } = project;
//       if (!projectRoot) return Promise.all([]);
//       return imageMapperList.map(async item => {
//         const filename = path.resolve(projectRoot, item.target);
//         // TODO: 失败的都默认通过，后面应把失败的返回出去以供提示
//         if (!item.md5) return Promise.resolve();
//         const imageData = await findImageData(item.md5);
//         if (!imageData.base64) return Promise.resolve();
//         return base64ToLocalFile(filename, imageData.base64).then(rewrite => {
//           rewrite && rewrite();
//         });
//       });
//     });
// }

// rebuildIndex();

// // 重建索引
// async function rebuildIndex() {
//   fse.ensureDirSync(PROJECTS_DB);
//   const projectFiles = fse
//     .readdirSync(PROJECTS_DB)
//     .filter(o => o !== "index") // 排除 index
//     .map(o => path.resolve(PROJECTS_DB, o)) // 补全路径
//     .filter(o => fse.existsSync(o)); // 排除不在的路径
//   projectFiles.forEach(async file => {
//     const project = await createNedb(file).findOne<TypeProjectData>({});
//     if (!project) return;
//     const count = await projectDB.count({ uuid: project.uuid });
//     if (count === 0 && project.uuid && project.brand?.type) {
//       projectDB.insert<TypeIndex>({
//         uuid: project.uuid,
//         brandType: project.brand?.type
//       });
//       console.log(`$重建索引: "${project.uuid}"]`);
//     }
//   });
// }

// 创建工程
export async function createProject(
  data: TypeCreateProjectPayload
): Promise<TypeProjectDataDoc> {
  const { brandInfo, projectInfo, projectRoot, sourceNamespace } = data;
  const sourceConfig = await new SourceConfig(sourceNamespace).getConfig();
  const projectData: TypeProjectData = {
    uuid: UUID(),
    projectInfo,
    brandInfo,
    uiVersion: sourceConfig.uiVersion,
    sourceConfig,
    projectRoot,
    imageMapperList: [],
    xmlMapperList: []
  };
  return projectDB.insert(projectData);
}

// brandType 筛选所有工程
export async function getProjectListOf(
  brandType: string
): Promise<TypeProjectDataDoc[]> {
  return projectDB
    .find<TypeProjectData>({ "brand.type": brandType })
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

// export async function addDatabasePropList<T>(data: T, prop: keyof T) {}

// 增加 imageMapperList
export async function addProjectImageMapper(
  uuid: string,
  imageMapper: TypeImageMapper
): Promise<TypeImageMapper[]> {
  const project = await updateProject(uuid, {
    $addToSet: { imageMapperList: imageMapper }
  });
  return project.imageMapperList;
}

// 删除 imageMapperList
export async function delProjectImageMapper(
  uuid: string,
  imageMapper: Partial<TypeImageMapper>
): Promise<TypeImageMapper[]> {
  const project = await updateProject(uuid, {
    $pull: { imageMapperList: imageMapper }
  });
  return project.imageMapperList;
}

// 更新 imageMapperList
export async function updateProjectImageMapper(
  uuid: string,
  imageMapper: TypeImageMapper
): Promise<TypeImageMapper[]> {
  await delProjectImageMapper(uuid, {
    target: imageMapper.target
  });
  return addProjectImageMapper(uuid, imageMapper);
}
