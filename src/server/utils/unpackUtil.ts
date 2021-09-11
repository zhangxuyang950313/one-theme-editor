import path from "path";
import fse from "fs-extra";
import JsZip from "jszip";
import micromatch from "micromatch";
import { TypePackConf } from "src/types/source";
import { PACK_TYPE } from "src/enum";
import { asyncQueue } from "src/utils";

export default class UnpackUtil {
  private file: string;
  private config: TypePackConf;
  private files: JsZip.JSZipObject[];
  constructor(file: string, config: TypePackConf) {
    this.file = file;
    this.config = config;
    this.files = [];
  }

  static async unpack(
    file: string,
    config: TypePackConf,
    outputDir: string
  ): Promise<string[]> {
    const unpackUtil = new UnpackUtil(file, config);
    await unpackUtil.unpackZip();
    await unpackUtil.output(outputDir);
    return unpackUtil.files.map(o => o.name);
  }

  // 获取 zip 中的文件列表
  static async getFiles(
    data: JsZip.InputType[keyof JsZip.InputType]
  ): Promise<{ [x: string]: JsZip.JSZipObject }> {
    const jsZip = await JsZip.loadAsync(data);
    return jsZip.files;
  }

  get filenames(): string[] {
    return this.files.map(o => o.name);
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
