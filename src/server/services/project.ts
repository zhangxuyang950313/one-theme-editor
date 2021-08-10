import path from "path";
import JsZip from "jszip";
import glob from "glob";
import fse from "fs-extra";
import archiver from "archiver";
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
import { TypePackageConf } from "src/types/source";
import { PACK_TYPE } from "src/enum";

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

/**
 * 打包工程
 * @param data
 */
export async function packProject(data: {
  projectRoot: string;
  outputDir: string;
  packConfig: TypePackageConf;
}): Promise<string[]> {
  const { projectRoot, outputDir, packConfig } = data;
  const zipOpt: JsZip.JSZipGeneratorOptions<"nodebuffer"> = {
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 9 }
  };
  const log: string[] = [];
  const zip = new JsZip();
  const queue = packConfig.items.map(async item => {
    const files = getFilesByPattern(item.path, projectRoot);
    switch (item.type) {
      // 文件和目录
      case PACK_TYPE.FILE:
      case PACK_TYPE.DIR: {
        zipFolderAndFile(zip, files, projectRoot);
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
          zipFolderAndFile(innerZip, Array.from(files), projectRoot);
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
  await zip.generateAsync(zipOpt).then(content => {
    console.log(`${outputDir}/a/example.zip`);
    fse.writeFileSync(`${projectRoot}/a/example.zip`, content);
  });
  return log;
}
