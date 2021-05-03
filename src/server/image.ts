import path from "path";
import fse from "fs-extra";
import Nedb from "nedb-promises";
import { USER_DATA } from "common/paths";
import { TypeImageData, TypeImageDataInDoc } from "types/project";

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
