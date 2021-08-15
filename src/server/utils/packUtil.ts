import path from "path";
import glob from "glob";
import fse from "fs-extra";
import JsZip from "jszip";
import { TypePackageConf } from "src/types/source";
import { PACK_TYPE } from "src/enum";
/**
 * 筛选一个字符串第一个 "/" 之前的前缀
 * @param str
 * @returns
 */
function filterPrefix(str: string): string {
  const strList = str.split("");
  let result = "";
  for (let i = 0; i < strList.length; i++) {
    if (strList[i] === "/") break;
    result += strList[i];
  }
  return result;
}

// 匹配文件
function getFilesByPattern(pattern: string, root: string) {
  return glob.sync(pattern, { cwd: root, root: root, strict: true });
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
export async function zipProjectByRules(
  root: string,
  items: TypePackageConf["items"]
): Promise<Buffer> {
  const zipOpt: JsZip.JSZipGeneratorOptions<"nodebuffer"> = {
    type: "nodebuffer",
    compression: "STORE"
    // compressionOptions: { level: 9 }
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
