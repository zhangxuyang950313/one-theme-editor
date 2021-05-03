import path from "path";
import fse from "fs-extra";
import _ from "lodash";
import {
  TypeOriginTempConf,
  TypeOriginBrandConf,
  TypeTempOriginPageConf
} from "types/xml-result";
import errCode from "renderer/core/error-code";
import {
  TypeBrandInfo,
  TypeTempPageConf,
  TypeTemplateConf,
  TypeImageData,
  TypePageConf,
  TypePreviewConf,
  TypeUiVersionConf
} from "types/project";
import { getTempDirByBrand, TEMPLATE_CONFIG } from "./paths";
import { TypeCreateProject } from "./Project";
import { xml2jsonCompact } from "./xmlCompiler";
import { getRandomStr, localImageToBase64Async } from "./utils";

// 解析厂商配置
export async function compileBrandConf(): Promise<TypeBrandInfo[]> {
  const data = await xml2jsonCompact<TypeOriginBrandConf>(TEMPLATE_CONFIG);
  if (!Array.isArray(data.brand)) return Promise.resolve([]);
  return data.brand.map(item =>
    _.pick(item._attributes, ["name", "templateDir", "type"])
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
  return {
    // root,
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

// 单个模板数据解析器
export default class Template {
  protected brandInfo: TypeBrandInfo;
  protected uiVersion: TypeUiVersionConf;
  protected templateConfList?: TypeTemplateConf[]; // 模板列表
  protected templateConf: TypeTemplateConf; // 模板原始配置
  protected previewConf?: TypePreviewConf; // 用于预览的配置
  protected imageData: TypeImageData[];
  protected pageConfData: TypePageConf[];
  protected imageDataMap!: { [x: string]: TypeImageData }; // 提供图片数据索引
  protected pageConfDataMap!: { [x: string]: TypePageConf }; // 提供页面配置数据索引
  private templateRoot: string; // 模板根目录

  constructor(props: TypeCreateProject) {
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
        console.warn(errCode[4002], err);
        return { key, base64: null };
      });
    return { key, task };
  }

  // 加载页面配置
  private loadPageConf(relativePath: string) {
    const key = getRandomStr();
    const file = this.resolveVersionPath(relativePath);
    const task = this.generatePagePreviewData(file)
      .then(conf => {
        const data = { key, conf };
        this.pageConfData.push(data);
        return data;
      })
      .catch(err => {
        console.warn(errCode[3003], file, err);
        return { key, conf: null };
      });
    return { key, task };
  }

  // 生成页面预览数据
  private async generatePagePreviewData(
    file: string
  ): Promise<TypeTempPageConf> {
    if (!fse.existsSync(file)) {
      return Promise.reject(new Error(errCode[3000]));
    }
    const root = path.dirname(file);
    const asyncQueue: Promise<TypeImageData>[] = [];
    const data = await xml2jsonCompact<TypeTempOriginPageConf>(file);
    const resolvePagePath = (relativePath: string) =>
      path.resolve(root, relativePath);
    return {
      root,
      config: {
        version: data.config?.[0]._attributes.version || "",
        description: data.config?.[0]._attributes.description || "",
        screenWidth: data.config?.[0]._attributes.screenWidth || ""
      },
      cover: (() => {
        const { key, task } = this.loadImage(
          resolvePagePath(data.cover?.[0]._attributes.src || "")
        );
        asyncQueue.push(task);
        return key;
      })(),
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
          from: (() => {
            const { key, task } = this.loadImage(
              resolvePagePath(item.from?.[0]._attributes.src || "")
            );
            asyncQueue.push(task);
            return key;
          })(),
          to: item.to?.map(o => o._attributes.src) || []
        })) || [],
      xml: []
    };
  }

  // 将模板转换成预览所需数据
  protected async generateTempPreviewData(): Promise<TypePreviewConf> {
    // 加载图片和页面配置的异步队列
    const asyncQueue: Promise<TypeImageData | TypePageConf>[] = [];
    const previewConf: TypePreviewConf = {
      ...this.templateConf,
      cover: (() => {
        const { key, task } = this.loadImage(
          this.resolveRootPath(this.templateConf.cover)
        );
        asyncQueue.push(task);
        return key;
      })(),
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
  public getPageConfByKey(key: string): TypePageConf | null {
    return this.pageConfDataMap[key] || null;
  }
}
