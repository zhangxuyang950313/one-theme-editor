import path from "path";
import fse from "fs-extra";
import _ from "lodash";
import * as uuid from "uuid";
import TemplateData from "src/data/TemplateConf";
// import TemplateInfo from "src/data/TemplateInfo";
import { TEMPLATE_CONFIG, getTempDirByBrand } from "common/paths";
import { TypeOriginBrandConf } from "types/xml-result";
import { TypeBrandConf, TypeCreateProjectData } from "types/project";
import { TypeTemplateConf, TypeTemplateData } from "types/template";

import { xml2jsonCompact } from "../core/xmlCompiler";
import Template from "../compiler/Template";

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
  templateData.setKey(uuid.v4());
  templateData.setRoot(path.dirname(file));
  templateData.setFile(file);
  templateData.setName(await template.getName());
  templateData.setPreview(await template.getPreview());
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
): Promise<TypeTemplateData> {
  const template = new Template(
    projectData.templateConf.file,
    projectData.uiVersionConf
  );
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
