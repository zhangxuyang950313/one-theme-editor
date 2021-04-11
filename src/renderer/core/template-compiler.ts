import path from "path";
import fse from "fs-extra";
import _ from "lodash";
import { xml2js, Options, Element, ElementCompact } from "xml-js";
import {
  TypeBrandInfo,
  TypeTempPageConf,
  TypePreviewConf,
  TypeTempConf,
  TypeClassConf
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
import { asyncMap, getRandomStr } from "./utils";

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

// 解析 xml 返回完整的数组形式数据
async function xml2jsonElements<T = Element>(file: string): Promise<T | []> {
  if (!fse.existsSync(file)) return Promise.resolve([]);
  return xml2jsonNormalized<T>(file, { compact: false });
}

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
export async function compilePageConf(
  file: string,
  pageKey: string
): Promise<TypeTempPageConf | null> {
  if (!fse.existsSync(file)) return Promise.resolve(null);
  const data = await xml2jsonCompact<TypeTempOriginPageConf>(file);
  console.log({ data });
  const result: TypeTempPageConf = {
    pageKey,
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
  return result;
}

// 解析模块所有预览图配置
export async function compilePreviewConf(
  tempConf: TypeTempConf,
  uiVersionSrc: string
): Promise<TypePreviewConf> {
  const { root } = tempConf;
  const queue: Promise<TypeTempPageConf | null>[] = [];
  const pageConfList: Array<TypeTempPageConf> = [];
  const result: TypePreviewConf = {
    modules:
      tempConf?.modules.map(moduleItem => {
        const classList: TypeClassConf[] = moduleItem.previewClass.map(
          classItem => {
            const pages = classItem.pages.map(pageItem => {
              const pageKey = getRandomStr();
              const file = path.resolve(root, uiVersionSrc, pageItem);
              const pageConf = compilePageConf(file, pageKey);
              queue.push(pageConf);
              return pageKey;
            });
            return { name: classItem.name, pages };
          }
        );
        return { name: moduleItem.name, classList };
      }) || [],
    pageConfList
  };
  const list = await Promise.all(queue);
  pageConfList.push(...(list.filter(Boolean) as TypeTempPageConf[]));
  return result;
}

// 获取模板配置信息
export async function compileTempConf(file: string): Promise<TypeTempConf> {
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
): Promise<TypeTempConf[]> {
  const getConfigQueue = getTempDescFileList(brandInfo).map(descFile =>
    compileTempConf(descFile)
  );
  return await Promise.all(getConfigQueue);
}
