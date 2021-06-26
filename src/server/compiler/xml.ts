import fse from "fs-extra";
import { xml2js, Options, Element, ElementCompact } from "xml-js";
import ERR_CODE from "renderer/core/error-code";

const config: Options.XML2JS = {
  trim: true,
  addParent: true,
  alwaysArray: true, // 仅适用于紧凑输出，单个元素使用对象形式
  nativeType: true, // 尝试将数字或布尔值字符串转换成对应类型
  // nativeTypeAttributes: false, // 尝试将数字或布尔值字符串属性转换成对应类型
  /**
   * <?go to="there"?>
   * will be
   * ```json
   * {"_instruction":{"go":{"_attributes":{"to":"there"}}}}
   * ```
   * rather than
   * ```json
   * {"_instruction":{"go":"to=\"there\""}}
   * ```
   */
  instructionHasAttributes: false, // 将指令解析为属性
  alwaysChildren: true, // 是否总是生成 elements 元素，即使为空
  ignoreDeclaration: true, // 忽略顶部声明属性
  ignoreComment: true, // 忽略注释
  ignoreInstruction: false, // 忽略处理指令
  ignoreAttributes: false, // 忽略属性
  ignoreCdata: false, // 忽略 cData
  ignoreDoctype: false, // 忽略文档
  ignoreText: false // 忽略纯文本
};

// xml 解析 json 数据
// 返回紧凑数据结构，适用于对象形式调用
export async function xml2jsonNormalized<T = Element>(
  file: string,
  options?: Options.XML2JS & { compact: false }
): Promise<T>;
// 返回完整递归数据结构，便于遍历查找
export async function xml2jsonNormalized<T = ElementCompact>(
  file: string,
  options?: Options.XML2JS & { compact: true }
): Promise<T>;
export async function xml2jsonNormalized(
  file: string,
  options?: Options.XML2JS
): Promise<Element | ElementCompact> {
  if (!fse.existsSync(file)) {
    throw new Error(`文件${file}不存在`);
  }
  const data = await fse.readFile(file, { encoding: "utf-8" });
  return xml2js(data, { ...config, ...options });
}

// 解析 xml 返回对象形式的紧凑数据
export async function xml2jsonCompact<T = ElementCompact>(
  file: string
): Promise<T | Partial<T>> {
  if (!fse.existsSync(file)) throw new Error(ERR_CODE[4005]);
  return xml2jsonNormalized(file, { compact: true });
}

// // 解析 xml 返回完整的数组形式数据
// async function xml2jsonElements<T = Element>(file: string): Promise<T | []> {
//   if (!fse.existsSync(file)) return Promise.resolve([]);
//   return xml2jsonNormalized<T>(file, { compact: false });
// }
