import path from "path";
import {
  TypeBrandInfo,
  TypeTemplateConf,
  TypeUiVersionInfo
} from "types/project";
import { compileBrandConf, getTempDescFileList } from "common/Template";
import { HOST, PORT } from "common/config";
import { getRandomStr, localImageToBase64Async } from "common/utils";
import { xml2jsonCompact } from "common/xmlCompiler";
import { TypeOriginTempConf } from "types/xml-result";
import TemplateConf from "src/data/TemplateConf";
import TemplateInfo from "src/data/TemplateInfo";
import { insertImageData } from "./image";

// 解析模板配置信息，该数据用于选择模板的预览，不需要全部解析，且此时并不知道选择的版本
async function compileTempConf(file: string): Promise<TypeTemplateConf> {
  const templateData = await xml2jsonCompact<TypeOriginTempConf>(file);
  const { description, poster, uiVersion } = templateData;
  const key = getRandomStr();
  const root = path.dirname(file);
  const cover = path.resolve(root, poster?.[0]._attributes?.src || "");
  const base64 = await localImageToBase64Async(cover);
  const { _id } = await insertImageData({ md5: "", base64 });
  const uiVersions =
    uiVersion?.map(o => ({
      name: o._attributes.name || "",
      src: o._attributes.src || "",
      code: o._attributes.code || ""
    })) || [];
  const templateConf = new TemplateConf();
  templateConf.setKey(key);
  templateConf.setName(description?.[0]?._attributes?.name || "");
  templateConf.setCover(`http://${HOST}:${PORT}/image/${_id}`);
  templateConf.setVersion(description?.[0]._attributes?.version || "");
  templateConf.setUiVersions(uiVersions);
  return templateConf.getData();
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

async function compileTempInfo(
  brandInfo: TypeBrandInfo,
  uiVersionInfo: TypeUiVersionInfo
) {
  const templateInfo = new TemplateInfo();
  // templateInfo.set
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
