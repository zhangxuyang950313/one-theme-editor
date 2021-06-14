import path from "path";
import fse from "fs-extra";
import Nedb from "nedb-promises";
import image2base64 from "image-to-base64";
import { USER_DATA } from "common/paths";
import { HOST, PORT } from "common/config";
import { getFileMD5 } from "common/utils";
import { TypeImageData, TypeImageDataInDoc } from "types/project";

const imageDBFile = path.resolve(USER_DATA, "image");
fse.ensureFileSync(imageDBFile);
const imageDB = new Nedb({
  filename: imageDBFile,
  autoload: true,
  timestampData: true
});

export async function ensureImageData(
  data: TypeImageData
): Promise<TypeImageDataInDoc> {
  const count = await imageDB.count({ md5: data.md5 });
  if (count > 0) {
    return imageDB.update<TypeImageData>({ md5: data.md5 }, data, {
      returnUpdatedDocs: true
    });
  }
  return imageDB.insert<TypeImageData>(data);
}

export async function findImageData(md5: string): Promise<TypeImageDataInDoc> {
  return imageDB.findOne<TypeImageData>({ md5 });
}

// 传入一个绝对路径，解析图片存入数据库并返回图片 url
export async function getImageUrlOf(file: string): Promise<string> {
  if (!file) {
    console.warn("图片路径为空");
    return "";
  }
  if (!fse.existsSync(file)) {
    console.warn(`路径 ${file}不存在`);
    return "";
  }
  const base64 = await image2base64(file);
  const md5 = await getFileMD5(file);
  await ensureImageData({ md5, base64 });
  return `http://${HOST}:${PORT}/image/${md5}`;
}
