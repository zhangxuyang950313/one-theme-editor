import path from "path";

import fse from "fs-extra";
import ERR_CODE from "src/common/enums/ErrorCode";
import { xml2js, Element, Options } from "xml-js";

import XMLNodeElement from "./XMLNodeElement";

const xml2jsConfig: Options.XML2JS = {
  trim: true,
  // sanitize: true,
  compact: false, // 使用 element 模式，这个一定不要改
  addParent: false,
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
  ignoreDeclaration: false, // 忽略顶部声明属性
  ignoreComment: false, // 忽略注释
  ignoreInstruction: false, // 忽略处理指令
  ignoreAttributes: false, // 忽略属性
  ignoreCdata: false, // 忽略 cData
  ignoreDoctype: false, // 忽略文档
  ignoreText: false // 忽略纯文本
};

/**
 * 基础解析器，继承于 XMLNodeElement，不同的是，传入的是 xml 文件路径
 * XmlCompiler 实现业务级基础的方法
 * XMLNodeElement 实现纯粹的节点解析方法
 */
export default class XmlCompiler extends XMLNodeElement {
  private file: string;
  constructor(file: string) {
    if (typeof file === "string" && !fse.existsSync(file)) {
      throw new Error(`${ERR_CODE[3000]}：${file}`);
    }
    try {
      const data = fse.readFileSync(file, { encoding: "utf-8" });
      super(XmlCompiler.fromString(data).getElement());
      this.file = file;
    } catch (err) {
      throw new Error(`${err}（${file}）`);
    }
  }

  /**
   * 从文件解析 xml
   * @param file 文件绝对路径
   * @returns
   */
  static fromFile(file: string): XmlCompiler {
    return new XmlCompiler(file);
  }

  protected getFile(): string {
    return this.file;
  }

  protected getFileName(): string {
    return path.basename(this.file);
  }

  /**
   *
   * 从字符串解析 xml
   * @param xmlStr xml 字符串
   * @param options
   */
  static fromString(data: string, options?: Options.XML2JS): XMLNodeElement {
    try {
      const element = xml2js(data, { ...xml2jsConfig, ...options }) as Element;
      return new XMLNodeElement(element);
    } catch (err) {
      throw new Error(`${ERR_CODE[3009]} ${err}`);
    }
  }
}
