import path from "path";
import fse from "fs-extra";
import _ from "lodash";
import {
  TypeBrandConf,
  TypeTempPageConf,
  TypeTemplateConf
} from "../types/project";
import {
  TypeOriginTempConf,
  TypeOriginBrandConf,
  TypeTempOriginPageConf
} from "../types/xml-result";
import errCode from "../renderer/core/error-code";
import { getTempDirByBrand, TEMPLATE_CONFIG } from "./paths";
import { xml2jsonCompact } from "./xmlCompiler";
import { getRandomStr } from "./utils";

// 解析厂商配置
export async function compileBrandConf(): Promise<TypeBrandConf[]> {
  const data = await xml2jsonCompact<TypeOriginBrandConf>(TEMPLATE_CONFIG);
  if (!Array.isArray(data.brand)) return Promise.resolve([]);
  return data.brand.map(item =>
    _.pick(item._attributes, ["name", "templateDir", "type"])
  );
}

// 模板描述文件列表
export const getTempDescFileList = (brandInfo: TypeBrandConf): string[] => {
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
    return Promise.reject(new Error(errCode[3000]));
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
        to: item.to?.map(item => item._attributes.src) || []
      })) || [],
    xml: []
  };
}

// 解析模板配置信息
export async function compileTempConf(file: string): Promise<TypeTemplateConf> {
  const templateData = await xml2jsonCompact<TypeOriginTempConf>(file);
  const { description, poster, uiVersion } = templateData;
  const root = path.dirname(file);
  const key = getRandomStr();
  return {
    // root,
    key,
    name: description?.[0]?._attributes?.name || "",
    version: description?.[0]._attributes?.version || "",
    cover: path.resolve(root, poster?.[0]._attributes?.src || ""),
    uiVersions:
      uiVersion?.map(o => ({
        name: o._attributes.name || "",
        src: o._attributes.src || "",
        code: o._attributes.code || ""
      })) || []
    // modules:
    //   modules?.map(moduleItem => ({
    //     name: moduleItem._attributes.name || "",
    //     icon: moduleItem._attributes.icon || "",
    //     previewClass:
    //       moduleItem.class?.map(classItem => ({
    //         name: classItem._attributes?.name || "",
    //         pages:
    //           classItem.page
    //             ?.map(page => page._attributes?.src || "")
    //             ?.filter(Boolean) || []
    //       })) || []
    //   })) || []
  };
}

// 获取所有模板配置列表
export async function getTempConfList(
  brandType: string
): Promise<TypeTemplateConf[]> {
  const brandConf = await compileBrandConf();
  const brandInfo = brandConf.find(o => o.type === brandType);
  if (!brandInfo) return [];
  const queue = getTempDescFileList(brandInfo).map(compileTempConf);
  return Promise.all(queue);
}
