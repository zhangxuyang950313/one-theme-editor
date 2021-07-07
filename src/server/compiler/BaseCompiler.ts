import fse from "fs-extra";
import ERR_CODE from "renderer/core/error-code";
import { xml2js, Element, ElementCompact, Options } from "xml-js";
import XMLNodeElement from "./XMLNodeElement";

const xml2jsConfig: Options.XML2JS = {
  trim: true,
  // sanitize: true,
  compact: false,
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
  ignoreComment: true, // 忽略注释
  ignoreInstruction: false, // 忽略处理指令
  ignoreAttributes: false, // 忽略属性
  ignoreCdata: false, // 忽略 cData
  ignoreDoctype: false, // 忽略文档
  ignoreText: false // 忽略纯文本
};

/**
 * 基础解析器，继承于 XMLNodeElement，不同的是，传入的是 xml 文件路径
 * BaseCompiler 实现业务级基础的方法
 * XMLNodeElement 实现纯粹的节点解析方法
 */
export default class BaseCompiler extends XMLNodeElement {
  private file: string;
  constructor(file: string) {
    super(BaseCompiler.compile(file));
    this.file = file;
  }

  protected getFile(): string {
    return this.file;
  }

  /**
   * 类静态解析 xml 方法
   * @param file
   * @param options
   */
  static compile<T extends Element>(
    file: string,
    options?: Options.XML2JS & { compact: false }
  ): T;
  static compile<T extends ElementCompact>(
    file: string,
    options?: Options.XML2JS & { compact: true }
  ): T;
  static compile(
    file: string,
    options?: Options.XML2JS
  ): Element | ElementCompact {
    if (!fse.existsSync(file)) throw new Error(`${ERR_CODE[3000]}：${file}`);
    const data = fse.readFileSync(file, { encoding: "utf-8" });
    try {
      return xml2js(data, { ...xml2jsConfig, ...options });
    } catch (err) {
      throw new Error(`${ERR_CODE[3009]} ${err.message}（${file}）`);
    }
  }

  /**
   * 实例上的解析方法
   * @returns
   */
  public compile(): Element {
    return BaseCompiler.compile(this.getFile());
  }

  /**
   * 以第一个节点作为根节点
   * @returns 返回这个节点的 node 实例
   */
  protected getRootNode(): XMLNodeElement {
    return super.getFirstChildNode();
  }

  /**
   * 获取根节点的子节点实例列表
   * @returns
   */
  protected getRootChildren(): XMLNodeElement[] {
    return this.getRootNode().getChildrenNodes();
  }

  /**
   * 获取根节点的第一个 {tagname} 节点
   * @param tagname
   * @returns
   */
  protected getRootFirstChildOf(tagname: string): XMLNodeElement {
    return this.getRootNode().getFirstChildNodeByTagname(tagname);
  }

  /**
   * 获取根节点所有 {tagname} 节点
   * @param tagname
   * @returns
   */
  protected getRootChildrenOf(tagname: string): XMLNodeElement[] {
    return this.getRootNode().getChildrenNodesByTagname(tagname);
  }
}
