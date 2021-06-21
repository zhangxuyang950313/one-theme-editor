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

/**
 * 注册目录下资源文件的监听
 * 实时写入工程文件
 * 此方法在注册 socket 只调用一次，fse.watch 的回调多次调用
 * @param uuid 工程目录
 */
export async function syncResource(uuid: string): Promise<void> {
  const project = await findProjectByUUID(uuid);
  if (!project?.localPath) return;
  const root = project.localPath;
  // 重设 imageMapperList
  const files = getDirAllFiles(root);
  const imageMapperList = await asyncMap(files, async file => {
    // TODO: 看看是用 filename 还是 buffer 判断图片好一些
    return filenameIsImage(file.name)
      ? await getImageMapper(file.path, root)
      : Promise.resolve();
  }).then(list => list.filter(Boolean));
  await updateProject(uuid, { $set: { imageMapperList } });
  // 监听文件变化
  fse.watch(root, { recursive: true }, async (event, filename) => {
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
        await addProjectImageMapper(uuid, imageMapper);
      } else {
        // 不存在则删除
        const imageMapper = await getImageMapper(file, root);
        await delProjectImageMapper(uuid, imageMapper);
      }
    }
  });
}
