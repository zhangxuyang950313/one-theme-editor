import path from "path";
import fse from "fs-extra";
import {
  filenameIsImage,
  filenameIsXml,
  getImageData
} from "src/common/utils/index";
import { findProjectByQuery } from "server/dbHandler/project";
import { TypeFileData } from "src/types/project";
import {
  ImageFileData,
  UnknownFileData,
  XmlFileData
} from "src/data/ProjectFileData";
import XmlFileCompiler from "server/compiler/XmlFileCompiler";
import PageConfigCompiler from "server/compiler/PageConfig";
import PackageUtil from "server/utils/PackageUtil";
import ImageUrlUtil from "common/utils/ImageUrlUtil";

export async function getPageResourceData(
  uuid: string,
  config: string
): Promise<Record<string, TypeFileData>> {
  const { root, resourceSrc } = await findProjectByQuery({ uuid });
  const namespace = path.dirname(resourceSrc);
  const resPathList = new PageConfigCompiler({
    namespace,
    config
  }).getResPathList();
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
    const url = ImageUrlUtil.getUrl(file);
    const imageData = new ImageFileData();
    imageData.set("url", url);
    imageData.set("src", src);
    if (fileExists) {
      imageData.set("data", getImageData(file));
    }
    return imageData.create();
  }
  if (filenameIsXml(file)) {
    const xmlData = new XmlFileData();
    xmlData.set("src", src);
    if (fileExists) {
      xmlData.set("data", XmlFileCompiler.from(file).getElement());
    }
    return xmlData.create();
  }
  // throw new Error(`不支持的文件类型"${src}"`);
  return new UnknownFileData().set("src", src).create();
}

// 打包工程
export const packProject = PackageUtil.pack;

// 解包工程
export const unpackProject = PackageUtil.unpack;
