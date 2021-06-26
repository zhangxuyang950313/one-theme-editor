import path from "path";
import fse from "fs-extra";
import Nedb from "nedb-promises";
import { USER_DATA } from "server/core/path-config";
import { TypeImageData, TypeImageDataDoc } from "types/project";

const imageDBFile = path.resolve(USER_DATA, "image");
fse.ensureFileSync(imageDBFile);
const imageDB = new Nedb({
  filename: imageDBFile,
  autoload: true,
  timestampData: true
});

/**
 * 图片存入数据库，若已存在则更新它
 * @param data
 * @returns
 */
export async function insertImageData(
  data: TypeImageData
): Promise<TypeImageDataDoc> {
  const count = await imageDB.count({ md5: data.md5 });
  if (count > 0) {
    return imageDB.update<TypeImageData>({ md5: data.md5 }, data, {
      returnUpdatedDocs: true
    });
  }
  return imageDB.insert<TypeImageData>(data);
}

// 获取一张图片信息
export async function findImageData(md5: string): Promise<TypeImageDataDoc> {
  return imageDB.findOne<TypeImageData>({ md5 });
}
