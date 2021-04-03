import fse from "fs-extra";
import _ from "lodash";
import { xml2js, Options, Element, ElementCompact } from "xml-js";
import { templateDescriptionList } from "@/config";
import { TypeTemplateConfig } from "@/types/project";
import { TypeTemplateConfigResult } from "@/types/xml-result";

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

// 返回对象形式的紧凑数据
async function xml2jsonCompact(file: string): Promise<ElementCompact> {
  return xml2jsonNormalized(file, { compact: true });
}

// 返回完整的数组形式数据
async function xml2jsonElements(file: string): Promise<Element> {
  return xml2jsonNormalized(file, { compact: false }) as Element;
}

// 获取所有模板配置列表
export async function getTemplateConfigList(): Promise<TypeTemplateConfig[]> {
  const templateConfigList = (await Promise.all(
    templateDescriptionList.map(xml2jsonCompact)
  )) as TypeTemplateConfigResult[];
  return templateConfigList.map<TypeTemplateConfig>(item => {
    const { description, poster, uiVersion, module: modules } = item;
    return {
      name: description?.[0]?._attributes?.name,
      version: description?.[0]._attributes?.version,
      poster: poster?.[0]._attributes?.src,
      uiVersions: uiVersion?.map(o => _.pick(o._attributes, ["name", "src"])),
      modules: modules?.map(moduleItem => ({
        ..._.pick(moduleItem?._attributes, ["name", "icon"]),
        previewClass: moduleItem?.class?.map(classItem => ({
          name: classItem._attributes?.name,
          pages: classItem?.page
            ?.map(pageItem => pageItem._attributes?.src || "")
            .filter(Boolean)
        }))
      }))
    };
  });
}

// 获取模板配置信息
export async function getTemplateConfig(
  file: string
): Promise<Element | ElementCompact> {
  const templateData = await xml2jsonCompact(file);
  return templateData;
}
