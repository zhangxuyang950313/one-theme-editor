import path from "path";
import fse from "fs-extra";
import { filenameIsImage, filenameIsXml, getImageData } from "src/utils/index";
import { findProjectByQuery } from "server/dbHandler/project";
import { TypeFileData } from "src/types/project";
import {
  ProjectFileImageData,
  ProjectFileUnknown,
  ProjectFileXmlData
} from "src/data/ProjectFileData";
import XmlFileCompiler from "server/compiler/XmlFileCompiler";
import PageConfigCompiler from "server/compiler/PageConfig";
import PackageUtil from "server/utils/PackageUtil";
import electronStore from "src/common/electronStore";

export async function getPageResourceData(
  uuid: string,
  config: string
): Promise<Record<string, TypeFileData>> {
  const { root, resourceSrc } = await findProjectByQuery({ uuid });
  const namespace = path.dirname(resourceSrc);
  const pageConfig = new PageConfigCompiler({ namespace, config });
  const resPathList = pageConfig.getResPathList();
  return resPathList.reduce<Record<string, TypeFileData>>((record, src) => {
    const fileData = getFileData(path.join(root, src), src);
    record[src] = fileData;
    return record;
  }, {});
}

/**
 * 解析文件数据
 * 目前支持 image 、 xml
 * @param uuid
 * @param file
 * @returns
 */
export function getFileData(file: string, src: string): TypeFileData {
  const fileExists = fse.pathExistsSync(file);
  if (filenameIsImage(file)) {
    const hostname = electronStore.get("hostname");
    const url = `http://${hostname}/image?filepath=${file}&time=${Date.now()}`;
    // const url = `one://${absPath}?t=${Date.now()}`;
    const imageData = new ProjectFileImageData();
    imageData.set("url", url);
    imageData.set("src", src);
    if (fileExists) {
      imageData.set("data", getImageData(file));
    }
    return imageData.create();
  }
  if (filenameIsXml(file)) {
    const xmlData = new ProjectFileXmlData();
    xmlData.set("src", src);
    if (fileExists) {
      xmlData.set("data", XmlFileCompiler.from(file).getElement());
    }
    return xmlData.create();
  }
  // throw new Error(`不支持的文件类型"${src}"`);
  return new ProjectFileUnknown().set("src", src).create();
}

// 打包工程
export const packProject = PackageUtil.pack;

// 解包工程
export const unpackProject = PackageUtil.unpack;
