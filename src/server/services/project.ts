import path from "path";
import fse from "fs-extra";
import { filenameIsXml, getImageData } from "common/utils";
import { findProjectByUUID } from "server/db-handler/project";
import { TypeProjectFileData } from "src/types/project";
import { filenameIsImage } from "src/common/utils";
import XmlFileCompiler from "server/compiler/XmlFileCompiler";
import {
  ProjectFileImageData,
  ProjectFileXmlData
} from "src/data/ProjectFileData";
import PageConfig from "server/compiler/PageConfig";

export async function getPageDefineSourceData(
  uuid: string,
  config: string
): Promise<Record<string, TypeProjectFileData>> {
  const { projectRoot, sourceConfigPath } = await findProjectByUUID(uuid);
  const namespace = path.dirname(sourceConfigPath);
  const pageConfig = new PageConfig({ namespace, config });
  const sourcePathList = pageConfig.getSourceDefinePathList();
  return sourcePathList.reduce<Record<string, TypeProjectFileData>>(
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
    const url = `http://localhost:30000/image?filepath=${absPath}&count=${new Date().getTime()}`;
    const data = new ProjectFileImageData() //
      .set("src", src)
      .set("url", url);
    if (fileExists) {
      data.set("imageData", getImageData(absPath));
    }
    return data.create();
  }
  if (filenameIsXml(src)) {
    const data = new ProjectFileXmlData().set("src", src);
    if (fileExists) {
      data.set("element", new XmlFileCompiler(absPath).getElement());
    }
    return data.create();
  }
  throw new Error("不支持的文件类型");
}
