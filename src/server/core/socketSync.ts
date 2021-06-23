import path from "path";
import fse from "fs-extra";
import {
  asyncMap,
  filenameIsImage,
  getDirAllFiles,
  getImageMapper
} from "common/utils";
import {
  addProjectImageMapper,
  delProjectImageMapper,
  findProjectByUUID,
  updateProject
} from "@/db-handler/project";
import { TypeImageMapper } from "types/project";

/**
 * 此文件导出方法应均符合 socket 同步方法协议
 * 第一个参数为客户端传入参数
 * 第二个参数为服务端主动回调函数
 */

// export async function syncProject(
//   uuid: string,
//   callback: (x: TypeProjectDataDoc) => void
// ): Promise<void> {}

/**
 * 注册目录下资源文件的监听
 * 实时写入工程文件
 * 此方法在注册 socket 只调用一次，fse.watch 的回调多次调用
 * @param uuid 工程目录
 */
export async function syncResource(
  uuid: string,
  callback: (x: TypeImageMapper[]) => void
): Promise<void> {
  let project = await findProjectByUUID(uuid);
  if (!project.localPath) return;
  const root = project.localPath;
  // 重设 imageMapperList
  const files = getDirAllFiles(root);
  const imageMapperList = await asyncMap(files, async file => {
    // TODO: 看看是用 filename 还是 buffer 判断图片好一些
    return filenameIsImage(file.name)
      ? await getImageMapper(file.path, root)
      : null;
  }).then(list => list.filter(Boolean));
  project = await updateProject(uuid, { $set: { imageMapperList } });
  callback(project.imageMapperList);
  // 监听文件变化
  console.log(`监听目录：${root}`);
  fse.watch(root, { recursive: true }, async (event, filename) => {
    console.log(event, filename);
    const file = path.join(root, filename);
    // 文件内容改变，但名字不变
    if (event === "change") {
      const imageMapper = await getImageMapper(file, root);
      await addProjectImageMapper(uuid, imageMapper);
    }
    // 文件重命名或者被移除会走到这里
    if (event === "rename") {
      if (fse.existsSync(file)) {
        // 存在则添加
        const imageMapper = await getImageMapper(file, root);
        const project = await addProjectImageMapper(uuid, imageMapper);
        callback(project);
      } else {
        // 不存在则删除，重命名的旧文件也会走到这里被删除
        const imageMapper = await getImageMapper(file, root);
        await delProjectImageMapper(uuid, imageMapper);
      }
    }
  });
}
