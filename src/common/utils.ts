import path from "path";
import md5 from "md5";
import fse from "fs-extra";
import FileType from "file-type";
import imageSizeOf from "image-size";
import image2base64 from "image-to-base64";
import dirTree from "directory-tree";
import { HOST, PORT } from "common/config";
import { insertImageData } from "src/server/db-handler/image";
import { TypeImageInfo, TypeImageMapper } from "types/project";
import ERR_CODE from "renderer/core/error-code";

export const base64Regex = /^data:image\/\w+;base64,/;

// 随机字符串，最多11位
export function getRandomStr(
  len: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 = 11
): string {
  return Math.random().toString(36).slice(2, len);
}

// 数组为空
export function arrayIsEmpty(data: unknown): boolean {
  return !(Array.isArray(data) && data.length > 0);
}

// 使用列表项目中的一个键值生成 map
// 键值如果非 string 类型则该项被忽略
export function arrayToMapByKey<T, K extends keyof T>(
  list: T[],
  key: K
): { [k: string]: T } {
  const map: { [k: string]: T } = {};
  list.forEach(item => {
    const k = item[key];
    if (typeof k === "string") {
      map[k] = item;
    }
  });
  return map;
}

// pick Object with def
export function pickObjectWithDef<T, U extends keyof T, D>(
  object: T,
  props: Array<U>,
  def: D
): { [k in U]: T[U] | D } {
  return props.reduce((t, o) => {
    t[o] = o in object ? object[o] : def;
    return t;
  }, {} as { [k in U]: T[U] | D });
}

// 异步 map
export async function asyncMap<T, R>(
  list: T[],
  callbackfn: (value: T, index: number, array: T[]) => Promise<R>
): Promise<R[]> {
  return await Promise.all(list.map(async (...args) => callbackfn(...args)));
}

// 去除字符串中空格、回车字符
export function replaceUseless(str: string): string {
  return str.replace(/\r\n|\n|\s/g, "");
}

// 检查路径是否为绝对路径且存在
export function checkPathExists(file: string): string {
  file = replaceUseless(file);
  return fse.existsSync(file) && path.isAbsolute(file) ? file : "";
}

// 本地图片转 base64 同步方法
export function localImageToBase64Sync(
  file: string
): { ext: string; base64: string } {
  const result = { ext: "", base64: "" };
  if (!file) return result;
  const extname = path.extname(file).replace(/^\./, "");
  if (!checkPathExists(file) || !extname) return result;
  const base64 = fse.readFileSync(file, "base64");
  result.ext = extname;
  result.base64 = `data:image/${extname};base64,${base64}`;
  return result;
}

// 本地图片转 base64 异步方法
export async function localImageToBase64Async(file: string): Promise<string> {
  if (!file) {
    throw new Error(`${ERR_CODE[4000]}: ${file}`);
  }
  const extname = path.extname(file).replace(/^\./, "");
  if (!checkPathExists(file) || !extname) {
    throw new Error(`${ERR_CODE[4001]}: ${file}`);
  }
  const base64 = await fse.readFile(file, "base64");
  return `data:image/${extname};base64,${base64}`;
}

// 检测 base64 是否是携带图片编码
export function checkImageBase64Format(base64: string): boolean {
  return base64Regex.test(base64);
}

// bae64 转 buffer
export function base64ToBuffer(base64: string): Buffer | null {
  return Buffer.from(base64.replace(base64Regex, ""), "base64");
}

// 将图片 base64 写入文件
// 路径和文件不存在会自动创建并写入
// 若已存在会返回一个执行覆盖的方法，外部进行二次确认覆盖操作
export async function base64ToLocalFile(
  target: string,
  base64: string
): Promise<(() => void) | void> {
  const buff = base64ToBuffer(base64);
  if (!buff) return Promise.reject(new Error("失败"));
  const writeFile = () => {
    fse.ensureDirSync(path.dirname(target));
    return fse.writeFile(target, buff);
  };
  if (fse.existsSync(target)) {
    return Promise.resolve(writeFile);
  }
  return writeFile();
}

// 获取图片 MD5
export async function getFileMD5(file: string): Promise<string> {
  const buff = await fse.readFile(file);
  return md5(buff);
}

// 获取图片尺寸
export function getImageSizeOf(
  file: string
): { width: number; height: number } {
  const dimensions = imageSizeOf(file);
  return { width: dimensions.width || 0, height: dimensions.height || 0 };
}

// 获取文件大小
export async function getFileSizeOfAsync(file: string): Promise<number> {
  const buff = await fse.readFile(file);
  return buff.byteLength;
}

// 获取文件大小
export function getFileSizeOf(file: string): number {
  return fse.readFileSync(file).byteLength;
}

// 获取图片信息
export async function getImageData(file: string): Promise<TypeImageInfo> {
  const filename = path.basename(file);
  const ninePatch = isNinePatchPath(file);
  const url = await getImageUrlOf(file);
  const md5 = url ? path.basename(url) : null;
  const size = getFileSizeOf(file);
  const { width, height } = getImageSizeOf(file);
  return {
    url,
    md5,
    width,
    height,
    size,
    filename,
    ninePatch
  };
}

// 获取图片映射信息
export async function getImageMapper(
  file: string,
  root: string
): Promise<TypeImageMapper> {
  const imageData = await getImageData(file);
  return { ...imageData, target: path.relative(root, file) };
}

// 传入一个绝对路径，解析图片存入数据库并返回图片 url
export async function getImageUrlOf(file: string): Promise<string | null> {
  if (!file) {
    console.warn("图片路径为空");
    return null;
  }
  if (!fse.existsSync(file)) {
    console.warn(`路径 ${file}不存在`);
    return null;
  }
  const base64 = await image2base64(file);
  const md5 = await getFileMD5(file);
  await insertImageData({ md5, base64 });
  return `http://${HOST}:${PORT}/image/${md5}`;
}

// is .9 path
export function isNinePatchPath(file: string): boolean {
  return /\.9\.png$/.test(file);
}

const IMAGE_EXT = Object.freeze(["png", "jpg", "jpeg", "webp"]);

/**
 * 文件名为图片，仅支持文件名，如果图片文件名被修改无法判断
 * 若判断文件名为图片，请使用 fileIsImage
 * @param filename 文件名
 * @returns
 */
export function filenameIsImage(filename: string): boolean {
  return IMAGE_EXT.includes(path.extname(filename).replace(/^\./, ""));
}

/**
 * 从文件流中获取图片类型，无视文件名称
 * @param file
 * @returns
 */
export async function fileIsImage(file: string): Promise<boolean> {
  const fileType = await FileType.fromFile(file);
  if (!fileType?.ext) return false;
  return IMAGE_EXT.includes(fileType?.ext);
}

// 获取一个目录下所有文件
export function getDirAllFiles(dir: string): dirTree.DirectoryTree[] {
  const result: dirTree.DirectoryTree[] = [];
  dirTree(dir, {}, data => {
    result.push(data);
  });
  return result;
}
