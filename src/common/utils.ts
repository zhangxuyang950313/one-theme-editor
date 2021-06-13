import path from "path";
import md5 from "md5";
import fse from "fs-extra";
import imageSizeOf from "image-size";
import { TypeImageDataVO } from "types/project.d";
import { getImageUrlOf } from "@/db-handler/image";
import errCode from "../renderer/core/error-code";

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
export async function asyncMap<T = any>(
  list: T[],
  callbackfn: (value: T, index: number, array: T[]) => T
): Promise<T[]> {
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
export function localImageToBase64Sync(file: string): string {
  if (!file) return "";
  const extname = path.extname(file).replace(/^\./, "");
  if (!checkPathExists(file) || !extname) return "";
  const base64 = fse.readFileSync(file, "base64");
  return `data:image/${extname};base64,${base64}`;
}

// 本地图片转 base64 异步方法
export function localImageToBase64Async(file: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error(`${errCode[4000]}: ${file}`));
      return;
    }
    const extname = path.extname(file).replace(/^\./, "");
    if (!checkPathExists(file) || !extname) {
      reject(new Error(`${errCode[4001]}: ${file}`));
      return;
    }
    const base64 = fse.readFileSync(file, "base64");
    resolve(`data:image/${extname};base64,${base64}`);
  });
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
export async function getFileSizeOf(file: string): Promise<number> {
  const buff = await fse.readFile(file);
  return buff.byteLength;
}

// 获取图片信息
export async function getImageData(file: string): Promise<TypeImageDataVO> {
  const url = await getImageUrlOf(file);
  const size = await getFileSizeOf(file);
  const { width, height } = getImageSizeOf(file);
  return { url, width, height, size, filename: path.basename(file) };
}
