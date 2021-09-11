import path from "path";
import pathUtil from "server/utils/pathUtil";
import glob from "glob";
import fse from "fs-extra";
import JsZip from "jszip";
import { TypePackConf } from "src/types/source";
import { PACK_TYPE } from "src/enum";
import { compactNinePatch } from "./NinePatchUtil";

export default class PackUtil {
  private packDir: string;
  private packConfig: TypePackConf;
  constructor(packDir: string, packConfig: TypePackConf) {
    this.packDir = packDir;
    this.packConfig = packConfig;
  }

  static pack(
    packDir: string,
    packConfig: TypePackConf,
    outputFile: string
  ): Promise<string[]> {
    return new PackUtil(packDir, packConfig).pack(outputFile);
  }

  // 匹配文件
  private static getFilesByPattern(pattern: string, root: string): string[] {
    return glob.sync(pattern, { cwd: root, root: root, strict: true });
  }

  /**
   * 筛选一个字符串第一个 "/" 之前的前缀
   * @param str
   * @returns
   */
  private static filterPrefix(str: string): string {
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
  static zipFolderAndFile(
    zipInstance: JsZip,
    files: string[],
    cwd: string,
    excludes: TypePackConf["excludes"] = []
  ): void {
    files.forEach(item => {
      // 命中正则排除
      const filename = path.dirname(item);
      const checkIsExcludes = excludes.some(item => {
        return new RegExp(item.regex).test(filename);
      });
      if (checkIsExcludes) {
        console.log(`打包排除 '${item}'`);
        return;
      }
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
  static async zipByRules(
    root: string,
    items: TypePackConf["items"],
    excludes: TypePackConf["excludes"] = []
  ): Promise<Buffer> {
    const zipOpt: JsZip.JSZipGeneratorOptions<"nodebuffer"> = {
      type: "nodebuffer",
      compression: "STORE"
      // compressionOptions: { level: 9 }
    };
    const zip = new JsZip();
    const queue = items.map(async item => {
      const files = PackUtil.getFilesByPattern(item.pattern, root);
      switch (item.type) {
        // 文件和目录
        case PACK_TYPE.FILE:
        case PACK_TYPE.DIR: {
          PackUtil.zipFolderAndFile(zip, files, root, excludes);
          break;
        }
        // 内联打包目录
        case PACK_TYPE.PACK: {
          // 把打包目录具有相同前缀的分组，key 为相同前缀字符串，作为内联打包文件名
          const filesGroup = files.reduce((map, o) => {
            const prefixDir = PackUtil.filterPrefix(o);
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
            PackUtil.zipFolderAndFile(
              innerZip,
              Array.from(files),
              root,
              excludes
            );
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
   * 打包步骤：
   * 1. 将工程中 .9 图片直接处理到缓存目录
   * 2. 将模板工程目录拷贝到临时目录，overwrite 为 false，不覆盖处理好的 .9 图片文件
   * 3. 根据打包配制酒进行打包
   * @param data
   */
  private async pack(outputFile: string): Promise<string[]> {
    const temporaryPath = path.join(
      pathUtil.PACK_TEMPORARY,
      path.basename(this.packDir)
    );
    console.log("工程目录: ", this.packDir);
    console.log("临时打包目录: ", temporaryPath);
    if (fse.existsSync(temporaryPath)) {
      fse.removeSync(temporaryPath);
    }
    // // 确保目录存在
    // fse.ensureDirSync(temporaryPath);
    const log: string[] = [];
    console.time("打包耗时");
    // 处理 .9 到临时目录
    if (this.packConfig.execute9patch) {
      console.log("开始处理 .9");
      console.time("处理.9耗时");
      await compactNinePatch(this.packDir, temporaryPath);
      console.log(".9 处理完毕");
      console.timeEnd("处理.9耗时");
    }
    // 拷贝目录，.9 处理过的不覆盖
    fse.copySync(this.packDir, temporaryPath, { overwrite: false });
    // zip 压缩
    console.time("压缩耗时");
    const content = await PackUtil.zipByRules(
      temporaryPath,
      this.packConfig.items,
      this.packConfig.excludes
    );
    console.timeEnd("压缩耗时");
    // 确保输出目录存在
    fse.ensureDirSync(path.dirname(outputFile));
    // 变更扩展名
    const pathObj = path.parse(outputFile);
    pathObj.ext = this.packConfig.extname;
    pathObj.base = `${pathObj.name}.${this.packConfig.extname}`;
    // 写入文件
    fse.outputFileSync(path.format(pathObj), content);
    fse.remove(temporaryPath).then(() => {
      console.log("删除临时目录");
    });
    console.timeEnd("打包耗时");
    return log;
  }
}
