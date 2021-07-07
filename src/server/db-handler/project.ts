import path from "path";
import fse from "fs-extra";
import { v4 as UUID } from "uuid";
import Nedb from "nedb-promises";
import PATHS, { resolveSourcePath } from "server/core/pathUtils";
import SourceConfig from "server/compiler/SourceConfig";
import ERR_CODE from "renderer/core/error-code";

import {
  TypeCreateProjectPayload,
  TypeProjectData,
  TypeProjectDataDoc
} from "types/project";

function createNedb(filename: string) {
  console.log({ filename });
  fse.ensureDirSync(path.dirname(filename));
  fse.ensureFileSync(filename);
  const db = new Nedb({
    filename,
    autoload: false,
    timestampData: true
  });
  // 创建数据库有，如果 filename 文件内容不是 nedb 能接受的数据格式则会导致服务崩溃
  db.load().catch(err => {
    // TODO 当数据库错误的处理办法
    console.log("db 文件错误");
  });
  return db;
}

// 频繁修改工程数据，常驻内存
const projectDB = createNedb(PATHS.PROJECTS_DB);

// // 把 imageMapper 内容同步到本地
// export async function imageMapperSyncToLocal(
//   uuid: string
// ): Promise<Promise<(() => void) | void>[]> {
//   return projectDB
//     .findOne<TypeProjectDataDoc>({ uuid })
//     .then(project => {
//       const { imageMapperList, projectPathname } = project;
//       if (!projectPathname) return Promise.all([]);
//       return imageMapperList.map(async item => {
//         const filename = path.resolve(projectPathname, item.target);
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
  const { brandInfo, projectInfo, projectPathname, sourceConfigUrl } = data;
  const uiVersion = new SourceConfig(
    resolveSourcePath(sourceConfigUrl)
  ).getUiVersion();
  return projectDB.insert<TypeProjectData>({
    uuid: UUID(),
    projectInfo,
    brandInfo,
    uiVersion,
    sourceConfigUrl,
    projectPathname
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
