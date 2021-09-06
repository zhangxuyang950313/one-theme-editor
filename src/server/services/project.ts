import path from "path";
import fse from "fs-extra";
import { filenameIsImage, filenameIsXml, getImageData } from "src/utils/index";
import { findProjectByQuery } from "server/db-handler/project";
import { TypeProjectFileData } from "src/types/project";
import { TypePackConf } from "src/types/source";
import {
  ProjectFileImageData,
  ProjectFileXmlData
} from "src/data/ProjectFileData";
import { zipProjectByRules } from "server/utils/packUtil";
import { compactNinePatch } from "server/utils/NinePatchUtil";
import XmlFileCompiler from "server/compiler/XmlFileCompiler";
import PageConfig from "server/compiler/PageConfig";
import pathUtil from "server/utils/pathUtil";

export async function getPageDefineSourceData(
  uuid: string,
  config: string
): Promise<Record<string, TypeProjectFileData>> {
  const { projectRoot, sourceConfigPath } = await findProjectByQuery({ uuid });
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
    // TODO host
    const url = `http://localhost:30000/image?filepath=${absPath}&time=${Date.now()}`;
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
  throw new Error("不支持的文件类型");
}

/**
 * 打包工程
 * 打包步骤：
 * 1. 将工程中 .9 图片直接处理到缓存目录
 * 2. 将模板工程目录拷贝到临时目录，overwrite 为 false，不覆盖处理好的 .9 图片文件
 * 3. 根据打包配制酒进行打包
 * @param data
 */
export async function packProject(data: {
  projectRoot: string;
  outputFile: string;
  packConfig: TypePackConf;
}): Promise<string[]> {
  const { projectRoot, outputFile, packConfig } = data;
  const temporaryPath = path.join(
    pathUtil.PACK_TEMPORARY,
    path.basename(projectRoot)
  );
  console.log("工程目录: ", projectRoot);
  console.log("临时打包目录: ", temporaryPath);
  if (fse.existsSync(temporaryPath)) {
    fse.removeSync(temporaryPath);
  }
  // // 确保目录存在
  // fse.ensureDirSync(temporaryPath);
  const log: string[] = [];
  console.time("打包耗时");
  // 处理 .9 到临时目录
  if (packConfig.execute9patch) {
    console.log("开始处理 .9");
    console.time("处理.9耗时");
    await compactNinePatch(projectRoot, temporaryPath);
    console.log(".9 处理完毕");
    console.timeEnd("处理.9耗时");
  }
  // 拷贝目录，.9 处理过的不覆盖
  fse.copySync(projectRoot, temporaryPath, { overwrite: false });
  // zip 压缩
  console.time("压缩耗时");
  const content = await zipProjectByRules(
    temporaryPath,
    packConfig.items,
    packConfig.excludes
  );
  console.timeEnd("压缩耗时");
  // 确保输出目录存在
  fse.ensureDirSync(path.dirname(outputFile));
  // 变更扩展名
  const pathObj = path.parse(outputFile);
  pathObj.ext = packConfig.extname;
  pathObj.base = `${pathObj.name}.${packConfig.extname}`;
  // 写入文件
  fse.outputFileSync(path.format(pathObj), content);
  fse.remove(temporaryPath).then(() => {
    console.log("删除临时目录");
  });
  console.timeEnd("打包耗时");
  return log;
}
