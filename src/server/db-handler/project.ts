import path from "path";
import fse from "fs-extra";
import { v4 as genUUID } from "uuid";
import Nedb from "nedb-promises";

import { PROJECTS_DB } from "common/paths";
import {
  TypeCreateProjectData,
  TypeProjectData,
  TypeProjectDataDoc
} from "types/project";
import ERR_CODE from "renderer/core/error-code";
import ProjectData from "src/data/ProjectData";
import { base64ToLocalFile } from "@/../common/utils";
import { compileTempInfo } from "./template";
import { findImageData } from "./image";

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

// 把 imageMapper 内容同步到本地
export async function imageMapperSyncToLocal(
  uuid: string
): Promise<Promise<(() => void) | void>[]> {
  return projectDB
    .findOne<TypeProjectDataDoc>({ uuid })
    .then(project => {
      const { imageMapperList, localPath } = project;
      if (!localPath) return Promise.all([]);
      return imageMapperList.map(async item => {
        const filename = path.resolve(localPath, item.target);
        const imageData = await findImageData(item.md5);
        // TODO: 失败的都默认通过，后面应把失败的返回出去以供提示
        if (!imageData.base64) return Promise.resolve();
        return base64ToLocalFile(filename, imageData.base64).then(next => {
          if (next) next();
        });
      });
    });
}

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
  data: TypeCreateProjectData
): Promise<TypeProjectDataDoc> {
  const uuid = genUUID();
  const template = await compileTempInfo(data);
  // 组装数据
  const projectData = new ProjectData();
  projectData.setDescription(data.description);
  projectData.setUuid(uuid);
  projectData.setBrand({
    type: data.brandConf.type,
    name: data.brandConf.name
  });
  projectData.setUiVersion({
    name: data.uiVersionConf.name,
    code: data.uiVersionConf.code
  });
  projectData.setTemplate(template);
  projectData.setLocalPath(data.localPath);
  return await projectDB.insert(projectData.getData());
}

// brandType 筛选所有工程
export async function getProjectListOf(
  brandType: string
): Promise<TypeProjectDataDoc[]> {
  return await projectDB
    .find<TypeProjectData>({ "brand.type": brandType })
    .sort({ updatedAt: -1 });
}

// 查找工程
export async function findProjectByUUID(
  uuid: string
): Promise<TypeProjectDataDoc | null> {
  return await projectDB.findOne({ uuid });
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
): Promise<TypeProjectDataDoc | null> {
  const updated = await projectDB.update<TypeProjectData>({ uuid }, data, {
    multi: true,
    upsert: true,
    returnUpdatedDocs: true
  });
  imageMapperSyncToLocal(uuid);
  if (!updated) throw new Error(ERR_CODE[2004]);
  return updated.length > 0 ? updated[0] : null;
}
