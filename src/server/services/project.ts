import path from "path";
import JsZip from "jszip";
import glob from "glob";
import fse, { ensureDirSync } from "fs-extra";
import { filenameIsImage, filenameIsXml, getImageData } from "src/utils/index";
import { findProjectByUUID } from "server/db-handler/project";
import { TypeProjectFileData } from "src/types/project";
import { TypePackageConf } from "src/types/source";
import { PACK_TYPE } from "src/enum";
import {
  ProjectFileImageData,
  ProjectFileXmlData
} from "src/data/ProjectFileData";
import { compactNinePatch } from "server/utils/packUtil";
import XmlFileCompiler from "server/compiler/XmlFileCompiler";
import PageConfig from "server/compiler/PageConfig";
import pathUtil from "server/utils/pathUtil";

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
    // TODO host
    const url = `http://localhost:30000/image?filepath=${absPath}&count=${new Date().getTime()}`;
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

// 匹配文件
function getFilesByPattern(pattern: string, root: string) {
  return glob.sync(pattern, { cwd: root, root: root, strict: true });
}

/**
 * 筛选一个字符串第一个 "/" 之前的前缀
 * @param str
 * @returns
 */
export function filterPrefix(str: string): string {
  const strList = str.split("");
  let result = "";
  for (let i = 0; i < strList.length; i++) {
    if (strList[i] === "/") break;
    result += strList[i];
  }
  return result;
}

/**
 * 压缩一个文件列表
 * @param zipInstance
 * @param files
 * @param cwd
 */
function zipFolderAndFile(
  zipInstance: JsZip,
  files: string[],
  cwd: string
): void {
  files.forEach(item => {
    const file = path.join(cwd, item);
    if (fse.statSync(file).isDirectory()) {
      // console.log(`folder: ${item}`);
      zipInstance.folder(item);
    } else {
      // console.log(`file: ${item}`);
      const folder = zipInstance.folder(path.dirname(item));
      if (!folder) return;
      folder.file(path.basename(item), fse.readFileSync(file));
    }
  });
}

// 按照压缩配置项对目录压缩打包
async function zipProjectByRules(
  root: string,
  items: TypePackageConf["items"]
): Promise<Buffer> {
  const zipOpt: JsZip.JSZipGeneratorOptions<"nodebuffer"> = {
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 9 }
  };
  const zip = new JsZip();
  const queue = items.map(async item => {
    const files = getFilesByPattern(item.path, root);
    switch (item.type) {
      // 文件和目录
      case PACK_TYPE.FILE:
      case PACK_TYPE.DIR: {
        zipFolderAndFile(zip, files, root);
        break;
      }
      // 内联打包目录
      case PACK_TYPE.PACK: {
        // 把打包目录具有相同前缀的分组，key 为相同前缀字符串，作为内联打包文件名
        const filesGroup = files.reduce((map, o) => {
          const prefixDir = filterPrefix(o);
          if (!prefixDir) return map;
          if (!map.has(prefixDir)) {
            map.set(prefixDir, new Set());
          }
          map.get(prefixDir)?.add(o);
          return map;
        }, new Map<string, Set<string>>());
        if (filesGroup.size === 0) break;
        // 迭代分组进行压缩
        for (const item of filesGroup.entries()) {
          const innerZip = new JsZip();
          const [dir, files] = item;
          if (!files) continue;
          zipFolderAndFile(innerZip, Array.from(files), root);
          zip.file(dir, await innerZip.generateAsync(zipOpt));
        }
        break;
      }
      default: {
        break;
      }
    }
  });
  await Promise.all(queue);
  return zip.generateAsync(zipOpt);
}

/**
 * 打包工程
 * @param data
 */
export async function packProject(data: {
  projectRoot: string;
  outputFile: string;
  packConfig: TypePackageConf;
}): Promise<string[]> {
  const { projectRoot, outputFile, packConfig } = data;
  const temporaryPath = path.join(
    pathUtil.PACK_TEMPORARY,
    path.basename(projectRoot)
  );
  console.log("工程目录: ", projectRoot);
  console.log("临时打包目录: ", temporaryPath);
  // 确保目录存在
  ensureDirSync(temporaryPath);
  if (fse.existsSync(temporaryPath)) {
    fse.removeSync(temporaryPath);
  }
  const log: string[] = [];
  // 处理 .9 到临时目录
  await compactNinePatch(projectRoot, temporaryPath);
  // 拷贝目录，.9 处理过的不覆盖
  fse.copySync(projectRoot, temporaryPath, { overwrite: false });
  // zip 压缩
  const content = await zipProjectByRules(temporaryPath, packConfig.items);
  // 确保输出目录存在
  ensureDirSync(path.dirname(outputFile));
  // 变更扩展名
  const pathObj = path.parse(outputFile);
  pathObj.ext = packConfig.extname;
  pathObj.base = `${pathObj.name}.${packConfig.extname}`;
  // 写入文件
  fse.outputFileSync(path.format(pathObj), content);
  fse.remove(temporaryPath).then(() => {
    console.log("删除临时目录");
  });
  return log;
}
