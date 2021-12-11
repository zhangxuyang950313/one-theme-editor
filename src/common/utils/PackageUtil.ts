import path from "path";

import glob from "glob";
import fse from "fs-extra";
import JsZip from "jszip";
import micromatch from "micromatch";
import PathUtil from "src/common/utils/PathUtil";
import { PACK_TYPE } from "src/common/enums";
import { asyncQueue } from "src/common/utils";
import { TypePackConfig } from "src/types/config.scenario";
import { TypeProgressData } from "src/types/project";
import { TypeUnpackPayload } from "src/types/ipc";

import { compactNinePatch } from "./NinePatchUtil";

export class PackUtil {
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
  private static zipFolderAndFile(
    zipInstance: JsZip,
    files: string[],
    cwd: string,
    excludes: TypePackConfig["excludes"] = []
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
    items: TypePackConfig["items"],
    excludes: TypePackConfig["excludes"] = []
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
   * 3. 根据打包配制进行打包
   * @param data
   */
  static async pack(
    data: { packDir: string; packConfig: TypePackConfig },
    callback: (x: TypeProgressData<number>) => void
  ): Promise<Buffer> {
    const temporaryPath = path.join(
      PathUtil.PACK_TEMPORARY,
      path.basename(data.packDir)
    );
    if (fse.existsSync(temporaryPath)) {
      fse.removeSync(temporaryPath);
    }
    // // 确保目录存在
    // fse.ensureDirSync(temporaryPath);
    console.time("打包耗时");

    // 处理 .9 到临时目录
    if (data.packConfig.execute9patch) {
      console.time("处理.9耗时");
      await compactNinePatch(data.packDir, temporaryPath);
      console.timeEnd("处理.9耗时");
    }
    // 拷贝目录，.9 处理过的不覆盖
    fse.copySync(data.packDir, temporaryPath, { overwrite: false });

    // zip 压缩
    console.time("压缩耗时");
    const content = await PackUtil.zipByRules(
      temporaryPath,
      data.packConfig.items,
      data.packConfig.excludes
    );
    console.timeEnd("压缩耗时");
    fse.remove(temporaryPath).then(() => {
      console.log("删除临时目录");
    });
    return content;
  }

  static output(content: Buffer, outputFile: string): void {
    // 确保输出目录存在
    fse.ensureDirSync(path.dirname(outputFile));
    // // 变更扩展名
    // const pathObj = path.parse(outputDir);
    // pathObj.ext = this.packConfig.extname;
    // pathObj.base = `${pathObj.name}.${this.packConfig.extname}`;
    // const file = path.join(outputDir, `${filename}.${this.packConfig.extname}`);
    // 写入文件
    fse.outputFileSync(outputFile, content);
    console.timeEnd("打包耗时");
  }
}

export class UnpackUtil {
  private unpackFile: string;
  private packConfig: TypePackConfig;
  private $onProcess?: (x: TypeProgressData) => void;
  constructor(data: { unpackFile: string; packConfig: TypePackConfig }) {
    this.unpackFile = data.unpackFile;
    this.packConfig = data.packConfig;
  }

  // 获取 zip 中的文件列表
  static async getFiles(
    data: JsZip.InputType
  ): Promise<{ [x: string]: JsZip.JSZipObject }> {
    const jsZip = await JsZip.loadAsync(data);
    return jsZip.files;
  }

  onProcess(cb: (x: TypeProgressData) => void): UnpackUtil {
    this.$onProcess = cb;
    return this;
  }

  private emitProcess(x: TypeProgressData) {
    this.$onProcess && this.$onProcess(x);
  }

  // 解包。生成文件列表
  async unpackZip(outputDir: string): Promise<string[]> {
    const queue: Array<() => Promise<void[]>> = [];
    const buffer = fse.readFileSync(this.unpackFile);
    const jsZip = await JsZip.loadAsync(buffer);
    const files: JsZip.JSZipObject[] = [];
    jsZip.forEach((relativePath, file) => {
      if (!file) return;
      files.push(file);
    });
    this.packConfig.items
      .slice()
      .reverse()
      .forEach(item => {
        const isPack = item.type === PACK_TYPE.PACK;
        const pattern = isPack ? path.dirname(item.pattern) : item.pattern;
        const matched = micromatch(
          files.map(_ => _.name),
          pattern
        );
        const matchTask = async () => {
          return Promise.all(
            matched.map(async filename => {
              const file = jsZip.file(filename);
              if (!file) return;
              // 打包配置继续解包
              if (isPack) {
                file.dir = true;
                const innerBuff = await file.async("nodebuffer");
                const innerJsZip = await JsZip.loadAsync(innerBuff);
                Object.keys(innerJsZip.files).forEach(innerFilename => {
                  const innerFile = innerJsZip.file(innerFilename);
                  if (!innerFile) return;
                  innerFile.name = path.join(filename, innerFile.name);
                  files.push(innerFile);
                });
                return;
              }
              files.push(file);
            })
          );
        };
        queue.push(matchTask);
      });
    await asyncQueue(queue);
    return this.output(files, outputDir);
  }

  // 输出文件
  private async output(
    files: JsZip.JSZipObject[],
    outputDir: string
  ): Promise<string[]> {
    // 最后统一过滤一下不符合 pattern 的文件
    files = files.filter(file => {
      return this.packConfig.items.some(item =>
        micromatch.contains(file.name, item.pattern)
      );
    });
    // fse.outputJSONSync(
    //   `${path.dirname(this.file)}/a.json`,
    //   this.files.map(o => o.name),
    //   { spaces: 2 }
    // );
    await Promise.all(
      files.map(async file => {
        const buff = await file.async("nodebuffer");
        const filepath = path.join(outputDir, file.name);
        const fileDir = path.dirname(filepath);
        if (file.dir) {
          fse.ensureDirSync(filepath);
        } else {
          fse.ensureDirSync(fileDir);
          fse.writeFileSync(filepath, buff);
        }
      })
    );
    return files.map(_ => _.name);
  }
}

export default class PackageUtil {
  static async unpack(
    data: TypeUnpackPayload,
    callback: (x: TypeProgressData) => void
  ): Promise<string[]> {
    return new UnpackUtil({
      unpackFile: data.unpackFile,
      packConfig: data.packConfig
    })
      .onProcess(callback)
      .unpackZip(data.outputDir);
  }
}
