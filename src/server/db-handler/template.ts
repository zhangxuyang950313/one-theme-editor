import path from "path";
import fse from "fs-extra";
import _ from "lodash";
import { TypeOriginBrandConf } from "types/xml-result";
import {
  TypeBrandConf,
  TypeCreateProjectData,
  TypeTemplateConf,
  TypeTemplateInfo
} from "types/project";
import TemplateData from "src/data/TemplateConf";
import TemplateInfo from "src/data/TemplateInfo";
import { HOST, PORT } from "common/config";
import { TEMPLATE_CONFIG, getTempDirByBrand } from "common/paths";
import { getRandomStr, localImageToBase64Async } from "common/utils";
import { xml2jsonCompact } from "../core/xmlCompiler";
import Template from "../core/Template";
import { insertImageData } from "./image";

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

// 解析模板配置信息，该数据用于选择模板的预览，不需要全部解析，且此时并不知道选择的版本
async function compileTempConf(file: string): Promise<TypeTemplateConf> {
  const template = new Template(file);
  const templateData = new TemplateData();
  const key = getRandomStr();
  const root = path.dirname(file);
  const preview = path.resolve(root, await template.getPreview());
  const base64 = await localImageToBase64Async(preview);
  const { _id } = await insertImageData({ md5: "", base64 });
  templateData.setKey(key);
  templateData.setRoot(root);
  templateData.setFile(file);
  templateData.setName(await template.getName());
  templateData.setPreview(`http://${HOST}:${PORT}/image/${_id}`);
  templateData.setVersion(await template.getVersion());
  templateData.setUiVersions(await template.getUiVersions());
  return templateData.getData();
  // return {
  //   // root,
  //   key,
  //   name: description?.[0]?._attributes?.name || "",
  //   version: description?.[0]._attributes?.version || "",
  //   cover: `http://${HOST}:${PORT}/image/${_id}`,
  //   uiVersions:
  //     uiVersion?.map(o => ({
  //       name: o._attributes.name || "",
  //       src: o._attributes.src || "",
  //       code: o._attributes.code || ""
  //     })) || []
  //   // modules:
  //   //   modules?.map(moduleItem => ({
  //   //     name: moduleItem._attributes.name || "",
  //   //     icon: moduleItem._attributes.icon || "",
  //   //     previewClass:
  //   //       moduleItem.class?.map(classItem => ({
  //   //         name: classItem._attributes?.name || "",
  //   //         pages:
  //   //           classItem.page
  //   //             ?.map(page => page._attributes?.src || "")
  //   //             ?.filter(Boolean) || []
  //   //       })) || []
  //   //   })) || []
  // };
}

export async function compileTempInfo(
  projectData: TypeCreateProjectData
): Promise<TypeTemplateInfo> {
  // const templateData = await xml2jsonCompact<TypeOriginTempConf>(
  //   projectData.templateConf.file
  // );
  const template = new Template(projectData.templateConf.file);
  template.setUiVersion(projectData.uiVersionConf);
  const templateInfo = new TemplateInfo();
  // templateInfo.set
  // return templateInfo.getData();
  return template.getTempInfo();
}

// 获取对应厂商模板
export async function getTemplates(
  brandType: string
): Promise<TypeTemplateConf[]> {
  const brandInfoList = await compileBrandConf();
  const brandInfo = brandInfoList.find(item => item.type === brandType);
  if (!brandInfo) return [];
  const queue = getTempDescFileList(brandInfo).map(compileTempConf);
  return await Promise.all(queue);
}
