import path from "path";
import fse from "fs-extra";
import Nedb from "nedb-promises";
import { USER_DATA } from "common/paths";
import { TypeImageData, TypeImageDataInDoc } from "types/project";
import { HOST, PORT } from "@/../common/config";
import { localImageToBase64Async } from "@/../common/utils";

const imageDBFile = path.resolve(USER_DATA, "image");
fse.ensureFileSync(imageDBFile);
const imageDB = new Nedb({
  filename: imageDBFile,
  autoload: true,
  timestampData: true
});

export async function insertImageData(
  data: TypeImageData
): Promise<TypeImageDataInDoc> {
  return imageDB.insert<TypeImageData>(data);
}

export async function findImageData(id: string): Promise<TypeImageDataInDoc> {
  return imageDB.findOne({ _id: id });
}

export async function getImageUrl(data: TypeImageData): Promise<string> {
  const { _id } = await insertImageData(data);
  return `http://${HOST}:${PORT}/image/${_id}`;
}

// 传入一个绝对路径，解析图片存入数据库并返回图片 url
export async function getImageUrlByAbsPath(p: string): Promise<string> {
  if (!p) {
    console.warn("图片路径为空");
    return "";
  }
  if (!fse.existsSync(p)) {
    console.warn(`路径 ${p}不存在`);
    return "";
  }
  const base64 = await localImageToBase64Async(p);
  return getImageUrl({ md5: "", base64 });
}
