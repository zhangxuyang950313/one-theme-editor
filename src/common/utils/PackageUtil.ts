import path from "path";
import glob from "glob";
import fse from "fs-extra";
import JsZip from "jszip";
import micromatch from "micromatch";
import pathUtil from "src/common/utils/pathUtil";
import { PACK_TYPE } from "src/enum";
import { asyncQueue } from "src/common/utils";
import { TypePackConfig } from "src/types/scenario.config";
import { TypePackProcess } from "src/types/socket";
import { compactNinePatch } from "./NinePatchUtil";

export class PackUtil {
  private packDir: string;
  private packConfig: TypePackConfig;
  constructor(packDir: string, packConfig: TypePackConfig) {
    this.packDir = packDir;
    this.packConfig = packConfig;
  }

  static pack(data: {
    packDir: string;
    packConfig: TypePackConfig;
    outputFile: string;
    onProcess?: (x: { msg: string; data: any }) => void;
  }): Promise<string[]> {
    const packUtil = new PackUtil(data.packDir, data.packConfig);
    if (data.onProcess) {
      packUtil.onProcess = data.onProcess;
    }
    return packUtil.pack(data.outputFile);
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

  onProcess(x: TypePackProcess): void {
    //
  }

  /**
   * 打包工程
   * 打包步骤：
   * 1. 将工程中 .9 图片直接处理到缓存目录
   * 2. 将模板工程目录拷贝到临时目录，overwrite 为 false，不覆盖处理好的 .9 图片文件
   * 3. 根据打包配制酒进行打包
   * @param data
   */
  async pack(outputFile: string): Promise<string[]> {
    const temporaryPath = path.join(
      pathUtil.PACK_TEMPORARY,
      path.basename(this.packDir)
    );
    this.onProcess({ msg: "工程目录: ", data: this.packDir });
    this.onProcess({ msg: "临时打包目录: ", data: temporaryPath });
    if (fse.existsSync(temporaryPath)) {
      fse.removeSync(temporaryPath);
    }
    // // 确保目录存在
    // fse.ensureDirSync(temporaryPath);
    const log: string[] = [];
    console.time("打包耗时");
    // 处理 .9 到临时目录
    if (this.packConfig.execute9patch) {
      this.onProcess({ msg: "开始处理 .9", data: null });
      console.time("处理.9耗时");
      await compactNinePatch(this.packDir, temporaryPath);
      this.onProcess({ msg: ".9 处理完毕", data: null });
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
    // // 变更扩展名
    // const pathObj = path.parse(outputDir);
    // pathObj.ext = this.packConfig.extname;
    // pathObj.base = `${pathObj.name}.${this.packConfig.extname}`;
    // const file = path.join(outputDir, `${filename}.${this.packConfig.extname}`);
    // 写入文件
    fse.outputFileSync(outputFile, content);
    fse.remove(temporaryPath).then(() => {
      console.log("删除临时目录");
    });
    console.timeEnd("打包耗时");
    return log;
  }
}

export class UnpackUtil {
  private file: string;
  private config: TypePackConfig;
  private files: JsZip.JSZipObject[];
  constructor(file: string, config: TypePackConfig) {
    this.file = file;
    this.config = config;
    this.files = [];
  }

  static async unpack(data: {
    unpackFile: string;
    packConfig: TypePackConfig;
    outputDir: string;
    onProcess?: (x: TypePackProcess) => void;
  }): Promise<string[]> {
    const unpackUtil = new UnpackUtil(data.unpackFile, data.packConfig);
    if (data.onProcess) {
      unpackUtil.onProcess = data.onProcess;
    }
    await unpackUtil.unpackZip();
    await unpackUtil.output(data.outputDir);
    return unpackUtil.files.map(o => o.name);
  }

  // 获取 zip 中的文件列表
  static async getFiles(
    data: JsZip.InputType
  ): Promise<{ [x: string]: JsZip.JSZipObject }> {
    const jsZip = await JsZip.loadAsync(data);
    return jsZip.files;
  }

  get filenames(): string[] {
    return this.files.map(o => o.name);
  }

  onProcess(x: TypePackProcess): void {
    //
  }

  // 解包。生成文件列表
  private async unpackZip(): Promise<JsZip.JSZipObject[]> {
    const queue: Array<() => Promise<void[]>> = [];
    const buffer = fse.readFileSync(this.file);
    const jsZip = await JsZip.loadAsync(buffer);
    this.files = [];
    jsZip.forEach((relativePath, file) => {
      if (!file) return;
      this.files.push(file);
    });
    this.config.items
      .slice()
      .reverse()
      .forEach(item => {
        const isPack = item.type === PACK_TYPE.PACK;
        const pattern = isPack ? path.dirname(item.pattern) : item.pattern;
        const matched = micromatch(this.filenames, pattern);
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
                  this.files.push(innerFile);
                });
                return;
              }
              this.files.push(file);
            })
          );
        };
        queue.push(matchTask);
      });
    await asyncQueue(queue);
    return this.files;
  }

  // 输出文件
  private async output(outputDir: string): Promise<string[]> {
    // 最后统一过滤一下不符合 pattern 的文件
    this.files = this.files.filter(file => {
      return this.config.items.some(item =>
        micromatch.contains(file.name, item.pattern)
      );
    });
    // fse.outputJSONSync(
    //   `${path.dirname(this.file)}/a.json`,
    //   this.files.map(o => o.name),
    //   { spaces: 2 }
    // );
    await Promise.all(
      this.files.map(async file => {
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
    return this.filenames;
  }
}

export default class PackageUtil {
  static pack = PackUtil.pack;
  static unpack = UnpackUtil.unpack;
}
