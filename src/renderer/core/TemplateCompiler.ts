import path from "path";
import fse from "fs-extra";
import _ from "lodash";
import { xml2js, Options, Element, ElementCompact } from "xml-js";
import {
  TypeBrandInfo,
  TypeTempPageConf,
  TypeTemplateConf,
  TypeImageData,
  TypePageConfData,
  TypePreviewConf,
  TypeTempUiVersionConf
} from "@/types/project";
import {
  TypeOriginTempConf,
  TypeOriginBrandConf,
  TypeTempOriginPageConf
} from "@/types/xml-result";
import {
  getTemplateDirByBrand as getTempDirByBrand,
  templateConfigFile
} from "@/config/paths";
import { getRandomStr, localImageToBase64Async } from "./utils";
import errCode from "./error-code";
import { TypeProjectProps } from "./Project";

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
async function xml2jsonNormalized<T = Element>(
  file: string,
  options?: Options.XML2JS & { compact: false }
): Promise<T>;
// 返回完整递归数据结构，便于遍历查找
async function xml2jsonNormalized<T = ElementCompact>(
  file: string,
  options?: Options.XML2JS & { compact: true }
): Promise<T>;
async function xml2jsonNormalized(
  file: string,
  options?: Options.XML2JS
): Promise<Element | ElementCompact> {
  if (!fse.existsSync(file)) {
    throw new Error(`文件${file}不存在`);
  }
  const data = await fse.readFile(file, { encoding: "utf-8" });
  const xmlData = xml2js(data, { ...config, ...options });
  return xmlData;
}

// 解析 xml 返回对象形式的紧凑数据
async function xml2jsonCompact<T = ElementCompact>(
  file: string
): Promise<T | Partial<T>> {
  if (!fse.existsSync(file)) return Promise.resolve({});
  return xml2jsonNormalized(file, { compact: true });
}

// // 解析 xml 返回完整的数组形式数据
// async function xml2jsonElements<T = Element>(file: string): Promise<T | []> {
//   if (!fse.existsSync(file)) return Promise.resolve([]);
//   return xml2jsonNormalized<T>(file, { compact: false });
// }

// 解析厂商配置
export async function compileBrandConf(): Promise<TypeBrandInfo[]> {
  const data = await xml2jsonCompact<TypeOriginBrandConf>(templateConfigFile);
  if (!Array.isArray(data.brand)) return Promise.resolve([]);
  return data.brand.map(item =>
    _.pick(item._attributes, ["name", "templateDir"])
  );
}

// 模板描述文件列表
export const getTempDescFileList = (brandInfo: TypeBrandInfo): string[] => {
  const brandTemplate = getTempDirByBrand(brandInfo);
  return fse.existsSync(brandTemplate)
    ? fse
        .readdirSync(brandTemplate)
        .map(dir => path.resolve(brandTemplate, dir, "description.xml"))
        .filter(fse.existsSync) // 排除不存在 description.xml 的目录
    : [];
};

// 解析单个预览页面配置
export async function compilePageConf(file: string): Promise<TypeTempPageConf> {
  if (!fse.existsSync(file)) {
    return Promise.reject(new Error(errCode[1001]));
  }
  const data = await xml2jsonCompact<TypeTempOriginPageConf>(file);
  return {
    root: path.dirname(file),
    config: {
      version: data.config?.[0]._attributes.version || "",
      description: data.config?.[0]._attributes.description || "",
      screenWidth: data.config?.[0]._attributes.screenWidth || ""
    },
    cover: data.cover?.[0]._attributes.src || "",
    category:
      data.category?.map(item => ({
        tag: item._attributes.tag || "",
        description: item._attributes.description || "",
        type: item._attributes.type || null
      })) || [],
    source:
      data.source?.map(item => ({
        description: item._attributes.description || "",
        layout: item.layout?.[0]._attributes || {},
        from: item.from?.[0]._attributes.src || "",
        to: item.from?.[0]._attributes.src || ""
      })) || [],
    xml: []
  };
}

// 加载图片，返回 key 和异步任务
const loadImageByFile = (file: string) => {
  const key = getRandomStr();
  const task = localImageToBase64Async(file)
    .then(base64 => ({ key, base64 }))
    .catch(err => {
      // todo log
      console.error(err);
      return { key, base64: null };
    });
  return { key, task };
};

// 解析页面数据
const loadPageConfByFile = (file: string) => {
  const key = getRandomStr();
  const task = compilePageConf(file)
    .then(conf => ({ key, conf }))
    .catch(err => {
      // todo log
      console.error(err);
      return { key, conf: null, imageQueue: [] };
    });
  return { key, task };
};

// // 解析 templateConf，将图片和页面配置生成预览数据
// // TypePreviewConf 结构暂时同 TypeTemplateConf
// export async function compilePreviewData(
//   tempConf: TypeTemplateConf,
//   uiVersionSrc: string
// ): Promise<TypePreviewData> {
//   const { root } = tempConf;
//   const imageQueue: Promise<TypeImageData>[] = [];
//   const pageConfQueue: Promise<TypePageConfData>[] = [];
//   // 相对模板根目录路径
//   // 一般是用于和 ui 版本无关的路径
//   const resolveRootPath = (p: string) => path.resolve(root, p);
//   // 相对 ui 版本路径
//   // 用于和 ui 版本紧密相关的路径
//   const resolveVersionPath = (p: string) => path.resolve(root, uiVersionSrc, p);
//   const loadImage = (file: string) => {
//     const { key, task } = loadImageByFile(file);
//     imageQueue.push(task);
//     return key;
//   };
//   const loadPageConf = (p: string) => {
//     const file = resolveVersionPath(p);
//     const { key, task } = loadPageConfByFile(file);
//     pageConfQueue.push(task);
//     return key;
//   };
//   const previewConf: TypeTemplateConf = {
//     ...tempConf,
//     cover: loadImage(resolveRootPath(tempConf.cover)),
//     modules: tempConf.modules.map(moduleItem => ({
//       ...moduleItem,
//       icon: loadImage(resolveRootPath(moduleItem.icon)),
//       previewClass: moduleItem.previewClass.map(classItem => ({
//         ...classItem,
//         pages: classItem.pages.map(pageFile =>
//           loadPageConf(resolveVersionPath(pageFile))
//         )
//       }))
//     }))
//   };
//   const imageData = await Promise.all(imageQueue);
//   const pageConfData = await Promise.all(pageConfQueue);
//   return { previewConf, imageData, pageConfData };
// }

// 解析模板配置信息
export async function compileTempConf(file: string): Promise<TypeTemplateConf> {
  const templateData = await xml2jsonCompact<TypeOriginTempConf>(file);
  const { description, poster, uiVersion, module: modules } = templateData;
  const root = path.dirname(file);
  return {
    key: getRandomStr(),
    root,
    name: description?.[0]?._attributes?.name || "",
    version: description?.[0]._attributes?.version || "",
    cover: poster?.[0]._attributes?.src || "",
    uiVersions:
      uiVersion?.map(o => ({
        name: o._attributes.name || "",
        src: o._attributes.src || "",
        code: o._attributes.code || ""
      })) || [],
    modules:
      modules?.map(moduleItem => ({
        name: moduleItem._attributes.name || "",
        icon: moduleItem._attributes.icon || "",
        previewClass:
          moduleItem.class?.map(classItem => ({
            name: classItem._attributes?.name || "",
            pages:
              classItem.page
                ?.map(page => page._attributes?.src || "")
                .filter(Boolean) || []
          })) || []
      })) || []
  };
}

// pagesConf: classItem.page
// ?.map(page => page._attributes.src || "")
// .filter(Boolean)
// .map(page => path.resolve(root, page))
// .filter(fse.existsSync)
// .map(getPageXmlConf)

// 获取所有模板配置列表
export async function getTempConfList(
  brandInfo: TypeBrandInfo
): Promise<TypeTemplateConf[]> {
  const queue = getTempDescFileList(brandInfo).map(compileTempConf);
  return Promise.all(queue);
}

type TypeImageDataMap = { [x: string]: TypeImageData };

type TypePageConfDataMap = { [x: string]: TypePageConfData };
// 单个模板数据解析器
export default class TemplateCompiler {
  protected brandInfo: TypeBrandInfo;
  protected uiVersion: TypeTempUiVersionConf;
  protected templateConfList?: TypeTemplateConf[]; // 模板列表
  protected templateConf: TypeTemplateConf; // 模板原始配置
  protected previewConf?: TypePreviewConf; // 用于预览的配置
  protected imageData: TypeImageData[];
  protected pageConfData: TypePageConfData[];
  protected imageDataMap!: TypeImageDataMap; // 提供图片数据索引
  protected pageConfDataMap!: TypePageConfDataMap; // 提供页面配置数据索引
  private templateRoot: string; // 模板根目录

  constructor(props: TypeProjectProps) {
    this.brandInfo = props.brandInfo;
    this.uiVersion = props.uiVersion;
    this.templateConf = props.templateConf;
    this.templateRoot = props.templateConf.root;
    this.imageData = [];
    this.pageConfData = [];
  }

  // 相对模板根目录路径
  // 一般是用于和 ui 版本无关的路径
  private resolveRootPath(relativePath: string) {
    return path.resolve(this.templateRoot, relativePath);
  }

  // 相对 ui 版本路径
  // 用于和 ui 版本紧密相关的路径
  private resolveVersionPath(relativePath: string) {
    return path.resolve(this.templateRoot, this.uiVersion.src, relativePath);
  }

  // 加载图片
  private loadImage(file: string) {
    const key = getRandomStr();
    const task = localImageToBase64Async(file)
      .then(base64 => {
        const data = { key, base64 };
        this.imageData.push(data);
        return data;
      })
      .catch(err => {
        console.warn(errCode[1005], err);
        return { key, base64: null };
      });
    return { key, task };
  }

  // 加载页面配置
  private loadPageConf(relativePath: string) {
    const file = this.resolveVersionPath(relativePath);
    const { key, task } = loadPageConfByFile(file);
    task
      .then(data => {
        this.pageConfData.push(data);
      })
      .catch(err => {
        console.warn(errCode[1006], err);
      });
    return { key, task };
  }

  // 将模板转换成预览所需数据
  async generatePreviewData(): Promise<TypePreviewConf> {
    // 加载图片和页面配置的异步队列
    const asyncQueue: Promise<TypeImageData | TypePageConfData>[] = [];
    const coverImage = this.loadImage(
      this.resolveRootPath(this.templateConf.cover)
    );
    asyncQueue.push(coverImage.task);
    const previewConf: TypePreviewConf = {
      ...this.templateConf,
      cover: coverImage.key,
      modules: this.templateConf.modules.map(moduleItem => ({
        ...moduleItem,
        icon: (() => {
          const { key, task } = this.loadImage(
            this.resolveRootPath(moduleItem.icon)
          );
          asyncQueue.push(task);
          return key;
        })(),
        previewClass: moduleItem.previewClass.map(classItem => ({
          ...classItem,
          pages: classItem.pages.map(pageFile => {
            const { key, task } = this.loadPageConf(
              this.resolveVersionPath(pageFile)
            );
            asyncQueue.push(task);
            return key;
          })
        }))
      }))
    };
    await Promise.all(asyncQueue);
    return previewConf;
  }

  // 使用 key 获取图片 base64
  public getBase64ByKey(key: string): string {
    return this.imageDataMap[key]?.base64 || "";
  }

  // 使用 key 获取页面配置
  public getPageConfByKey(key: string): TypePageConfData | null {
    return this.pageConfDataMap[key] || null;
  }
}
