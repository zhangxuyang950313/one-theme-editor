import path from "path";
import fse from "fs-extra";
import _ from "lodash";
import {
  asyncMap,
  filenameIsImage,
  getDirAllFiles,
  getFileMD5,
  getImageMapper,
  union
} from "common/utils";
import {
  delProjectImageMapper,
  findProjectByUUID,
  updateProjectImageMapper
} from "@/db-handler/project";
import { TypeImageMapper } from "types/project";

// 本地目标路径的所有图片数据同步到 projectData.imageMapperList 数据库中
// 保持数据库中的图片数据和本地一致
async function syncLocalDirImageToMapperList(uuid: string) {
  const { imageMapperList, localPath } = await findProjectByUUID(uuid);
  const localTargets = getDirAllFiles(localPath)
    // 过滤文件名不是图片的
    // TODO: 可以使用 fileIsImage 来判断，这样可以容错忘记写后缀名的图片（优化点）
    .filter(item => filenameIsImage(item.name))
    // map 成相对路径，便于和 imageMapperList 做对比
    .map(item => path.relative(localPath, item.path));
  const mapperTargets = imageMapperList.map(item => item.target);
  // 并集数据库和本地的图片
  const targets = union(localTargets, mapperTargets);
  // 全遍历
  return asyncMap(targets, async target => {
    const absPath = path.join(localPath, target);
    const mapper = imageMapperList.find(o => o.target === target);
    if (fse.existsSync(absPath)) {
      if (mapper?.md5 !== (await getFileMD5(absPath))) {
        console.log("增加图片:", target);
        const imageMapper = await getImageMapper(absPath, localPath);
        await updateProjectImageMapper(uuid, imageMapper);
      }
    } else if (mapper) {
      console.log("删除图片:", target);
      await delProjectImageMapper(uuid, { target });
    }
    return Promise.resolve();
  });
}

/**
 * 注册目录下资源文件的监听
 * 实时写入工程文件
 * 此方法在注册 socket 只调用一次，fse.watch 的回调多次调用
 * @param uuid 工程目录
 */
export async function syncImageMapperList(
  uuid: string,
  callback: (x: TypeImageMapper[]) => void
): Promise<void> {
  let previousImageMapperList: TypeImageMapper[] | undefined;
  const { localPath } = await findProjectByUUID(uuid);
  const handleSync = async () => {
    console.log("handleSync");
    await syncLocalDirImageToMapperList(uuid);
    const { imageMapperList } = await findProjectByUUID(uuid);
    // TODO: 观察下图片多的时候性能
    if (_.isEqual(previousImageMapperList, imageMapperList)) return;
    callback(imageMapperList);
    previousImageMapperList = imageMapperList;
  };
  await handleSync();
  /**
   * 监听文件变化
   * fs.watch API 跨平台并非 100% 一致，并且在某些情况下不可用。
   * 递归选项仅在 macOS 和 Windows 上受支持。 当在不支持它的平台上使用该选项时，将抛出 ERR_FEATURE_UNAVAILABLE_ON_PLATFORM 异常。
   * 在 Windows 上，如果监视目录被移动或重命名，则不会触发任何事件。 删除监视目录时报 EPERM 错误。
   */
  console.log(`监听目录：${localPath}`);
  // let previousFiles
  fse.watch(localPath, { recursive: true }, (event, filename) => {
    console.log({ event, filename });
    // previousFiles = getDirAllFiles(localPath).map(o=>o.)
    handleSync();
  });
}
