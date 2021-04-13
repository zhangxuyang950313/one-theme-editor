import path from "path";
import fse from "fs-extra";
import errCode from "./error-code";

// 随机字符串，最多11位
export function getRandomStr(
  len: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 = 11
): string {
  return Math.random().toString(36).slice(2, len);
}

// 数组为空
export function arrayIsEmpty(data: unknown): boolean {
  return !!(Array.isArray(data) && data.length);
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
export function localImageToBase64Sync(file: TypePathLike): TypeBase64 {
  if (!file) return "";
  const extname = path.extname(file).replace(/^\./, "");
  if (!checkPathExists(file) || !extname) return "";
  const base64 = fse.readFileSync(file, "base64");
  return `data:image/${extname};base64,${base64}`;
}

// 本地图片转 base64 异步方法
export function localImageToBase64Async(
  file: TypePathLike
): Promise<TypeBase64> {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error(`${errCode[1002]}: ${file}`));
      return;
    }
    const extname = path.extname(file).replace(/^\./, "");
    if (!checkPathExists(file) || !extname) {
      reject(new Error(`${errCode[1003]}: ${file}`));
      return;
    }
    const base64 = fse.readFileSync(file, "base64");
    resolve(`data:image/${extname};base64,${base64}`);
  });
}
