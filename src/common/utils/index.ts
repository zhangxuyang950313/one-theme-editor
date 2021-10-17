import path from "path";
import md5 from "md5";
import fse from "fs-extra";
import FileType, { FileTypeResult, MimeType } from "file-type";
import mimeTypes from "mime-types";
import imageSize from "image-size";
import dirTree from "directory-tree";
import ImageData from "src/data/ImageData";
import ERR_CODE from "src/constant/errorCode";
import RegexpUtil from "src/common/utils/RegexpUtil";
import { TypeImageData, TypeImageMapper } from "src/types/project";
import { TypeFileData } from "src/types/resource.page";
import { FileData, ImageFileData, XmlFileData } from "src/data/ResourceConfig";
import XmlFileCompiler from "server/compiler/XmlFileCompiler";
import XmlCompilerExtra from "server/compiler/XmlCompilerExtra";

export const base64Regex = /^data:image\/\w+;base64,/;

// 随机字符串，最多11位
export function getRandomStr(
  len: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11][number] = 11
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

/**
 * 异步队列
 * @param list
 */
export async function asyncQueue<T>(
  list: Array<() => Promise<T>>,
  space = 0
): Promise<T[]> {
  const result: T[] = [];
  const fail: string[] = [];
  for (const fn of list.filter(item => item instanceof Function)) {
    await fn()
      ?.then(result.push.bind(result))
      .catch(err => fail.push(err));
    if (space) await sleep(space);
  }
  if (fail.length) throw new Error(String(fail));
  return result;
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
export function localImageToBase64Sync(file: string): {
  ext: string;
  base64: string;
} {
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
export function getImageSize(file: string): {
  width: number;
  height: number;
} {
  const dimensions = imageSize(file);
  return { width: dimensions.width || 0, height: dimensions.height || 0 };
}

// 获取文件大小
export async function getFileSizeOfAsync(file: string): Promise<number> {
  const buff = await fse.readFile(file);
  return buff.byteLength;
}

// 获取文件大小
export function getFileSize(file: string): number {
  return fse.readFileSync(file).byteLength;
}

// 获取图片信息
export function getImageData(file: string): TypeImageData {
  if (!file) {
    throw new Error(`${ERR_CODE[4000]}: ${file}`);
  }
  if (!fse.existsSync(file)) {
    throw new Error(`${ERR_CODE[4003]}: ${file}`);
  }
  const { width, height } = getImageSize(file);
  return new ImageData()
    .set("width", width)
    .set("height", height)
    .set("size", getFileSize(file))
    .set("filename", path.basename(file))
    .set("ninePatch", filenameIsNinePatch(file))
    .create();
}

// 获取图片映射信息
export function getImageMapper(file: string, root: string): TypeImageMapper {
  const imageData = getImageData(file);
  // TODO: 大集合解构小集合不报错？ 先这么写
  return {
    // md5: imageData.md5,
    width: imageData.width,
    height: imageData.height,
    size: imageData.size,
    filename: imageData.filename,
    ninePatch: imageData.ninePatch,
    target: path.relative(root, file)
  };
}

// is .9 path
export function filenameIsNinePatch(file: string): boolean {
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
export async function fileIsImageAsync(file: string): Promise<boolean> {
  try {
    const fileType = await FileType.fromFile(file);
    if (!fileType?.ext) return false;
    return IMAGE_EXT.includes(fileType?.ext);
  } catch (err) {
    return false;
  }
}
/**
 * 判断文件后缀为 xml
 * @param filename
 * @returns
 */
export function filenameIsXml(filename: string): boolean {
  return path.extname(filename) === ".xml";
}

// 获取一个目录下所有文件
export function getDirAllFiles(dir: string): dirTree.DirectoryTree[] {
  const result: dirTree.DirectoryTree[] = [];
  dirTree(dir, {}, data => {
    result.push(data);
  });
  return result;
}

// 两个数组的并集
export function union(arr1: string[], arr2: string[]): string[] {
  return Array.from(new Set([...arr1, ...arr2]));
}

/**
 * 睡眠定时器
 * @param delay
 * @returns
 */
export async function sleep(delay: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * 获取占位模板字符串值
 * ```
 * ${class_integer_checkbox_stroke_d} -> class_integer_checkbox_stroke_d
 * ```
 * @param val
 * @returns string | null
 */
export function getPlaceholderVal(val: string): string | null {
  const match = RegexpUtil.placeholderRegexp.exec(val);
  return match && match[1] ? match[1] : null;
}

/**
 * 检测 URL 字符串
 * @param str
 * @returns
 */
export function isURL(str: string): boolean {
  return RegexpUtil.urlRegexp.test(str);
}

export async function getImgBuffAndFileType(
  file: string
): Promise<{ buff: Buffer; fileType: FileTypeResult }> {
  if (!fse.existsSync(file)) {
    throw new Error(ERR_CODE[4003]);
  }
  const buff = fse.readFileSync(file);
  const fileType = await FileType.fromBuffer(buff);
  if (!fileType) {
    throw new Error(ERR_CODE[4003]);
  }
  return { buff, fileType };
}

/**
 * 获取文件信息
 * @param file
 * @param options { ignoreXmlElement:boolean // 忽略解析 xml  element，返回为空，默认为 true}
 * @returns
 */
export function getFileData(
  file: string,
  options?: { ignoreXmlElement?: boolean }
): TypeFileData {
  if (!fse.existsSync(file)) return FileData.default;
  const mimeType = (mimeTypes.lookup(file) || "") as MimeType;
  switch (mimeType) {
    case "image/webp":
    case "image/png":
    case "image/gif":
    case "image/jpeg": {
      const imageData = getImageData(file);
      const imageFileData = new ImageFileData()
        .set("fileType", mimeType)
        .set("width", imageData.width)
        .set("height", imageData.height)
        .set("size", imageData.size)
        .set("is9patch", filenameIsNinePatch(file))
        .create();
      return imageFileData;
    }
    case "application/xml": {
      const xmlFileCompiler = XmlFileCompiler.from(file);
      // 生成 value 映射
      const valueMapper = xmlFileCompiler
        .getChildrenFirstElementNode()
        .getChildrenNodes()
        .reduce<Record<string, string>>((prev, item) => {
          if (!item.isElement) return prev;
          const template = XmlCompilerExtra.generateXmlNodeStr({
            tag: item.getTagname(),
            attributes: item.getAttributes()
          });
          prev[template] = item.getChildrenFirstTextValue();
          return prev;
        }, {});
      const xmlFileData = new XmlFileData()
        .set("fileType", mimeType)
        .set("size", getFileSize(file))
        .set("valueMapper", valueMapper);
      if (!options?.ignoreXmlElement) {
        xmlFileData.set("element", xmlFileCompiler.getElement());
      }
      return xmlFileData.create();
    }
    default: {
      return FileData.default;
    }
  }
}