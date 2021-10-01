import path from "path";
import fse from "fs-extra";
import { filenameIsImage, filenameIsXml, getImageData } from "src/utils/index";
import { findProjectByQuery } from "server/db-handler/project";
import { TypeProjectFileData } from "src/types/project";
import {
  ProjectFileImageData,
  ProjectFileUnknown,
  ProjectFileXmlData
} from "src/data/ProjectFileData";
import XmlFileCompiler from "server/compiler/XmlFileCompiler";
import PageConfig from "server/compiler/PageConfig";
import PackageUtil from "server/utils/PackageUtil";
import electronStore from "src/common/electronStore";

export async function getPageDefineSourceData(
  uuid: string,
  config: string
): Promise<Record<string, TypeProjectFileData>> {
  const { projectRoot, resourceConfigPath } = await findProjectByQuery({
    uuid
  });
  const namespace = path.dirname(resourceConfigPath);
  const pageConfig = new PageConfig({ namespace, config });
  const resourcePathList = pageConfig.getResourceDefinePathList();
  return resourcePathList.reduce<Record<string, TypeProjectFileData>>(
    (record, src) => {
      record[src] = getProjectFileData(projectRoot, src);
      return record;
    },
    {}
  );
}

/**
 * 解析工程目录下 filepath 文件的数据
 * 目前支持 image 、 xml
 * @param uuid
 * @param file
 * @returns
 */
export function getProjectFileData(
  projectRoot: string,
  src: string
): TypeProjectFileData {
  const absPath = path.join(projectRoot, src);
  const fileExists = fse.pathExistsSync(absPath);
  if (filenameIsImage(src)) {
    const hostname = electronStore.get("hostname");
    const url = `http://${hostname}/image?filepath=${absPath}&time=${Date.now()}`;
    const data = new ProjectFileImageData();
    data.set("src", src);
    data.set("url", url);
    if (fileExists) {
      data.set("imageData", getImageData(absPath));
    }
    return data.create();
  }
  if (filenameIsXml(src)) {
    const data = new ProjectFileXmlData();
    data.set("src", src);
    if (fileExists) {
      data.set("element", new XmlFileCompiler(absPath).getElement());
    }
    return data.create();
  }
  // throw new Error(`不支持的文件类型"${src}"`);
  return new ProjectFileUnknown().set("src", src).create();
}

// 打包工程
export const packProject = PackageUtil.pack;

// 解包工程
export const unpackProject = PackageUtil.unpack;
