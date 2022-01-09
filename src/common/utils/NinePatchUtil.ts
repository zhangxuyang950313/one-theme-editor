import os from "os";
import path from "path";
import childProcess from "child_process";

import md5 from "md5";
import fse from "fs-extra";
import dirTree from "directory-tree";
import PathUtil from "src/common/utils/PathUtil";
import { fileCache } from "main/singletons/fileCache";

type TypeRange = readonly [number, number];
type TypeNinePatchData = {
  padLeft: number;
  padRight: number;
  padTop: number;
  padBottom: number;
  xDivs: number[];
  yDivs: number[];
};
export class NinePatch {
  private static readonly PNG_RANGE: TypeRange = [0, 8];
  // PNG 标识
  private static readonly PNG_IDENTIFIER = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  private static readonly npTc_RANGE: TypeRange = [73, 77]; // npTc 区间
  private static readonly npOl_RANGE: TypeRange = [37, 41]; // npOl 区间
  // npTc 标识
  private static readonly npTc_IDENTIFIER = Buffer.from([0x6e, 0x70, 0x54, 0x63]);
  // npOl 标识
  private static readonly npOl_IDENTIFIER = Buffer.from([0x6e, 0x70, 0x4f, 0x6c]);
  private static readonly IHDR_OFFSET = 8; // IHDR 起点
  private static readonly IHDR_LENGTH = 8; // IHDR 总长度
  private static readonly IHDR_RANGE: TypeRange = [12, 16]; // IHDR 标识区间
  // IHDR 标识
  private static readonly IHDR_IDENTIFIER = Buffer.from([0x49, 0x48, 0x44, 0x52]);
  private static readonly IHDR_LENGTH_RANGE: TypeRange = [8, 12]; // IHDR 数据长度数据区间
  private static readonly IHDR_WIDTH_RANGE: TypeRange = [16, 20]; // IHDR 图片宽度数据区间
  private static readonly IHDR_HEIGHT_RANGE: TypeRange = [20, 24]; // IHDR 图片高度数据区间
  private static readonly IHDR_DEPTH_INDEX = 24;
  private static readonly IHDR_COLOR_TYPE_INDEX = 25;
  private static readonly IHDR_COMPRESSION_INDEX = 26;
  private static readonly IHDR_FILTER_INDEX = 27;
  private static readonly IHDR_INTERLACE_INDEX = 28;
  private static readonly X_DIVS_INDEX = 78;
  private static readonly Y_DIVS_INDEX = 79;
  private static readonly X_DIVS_OFFSET = 109;
  private static readonly PAD_LEFT_RANG: TypeRange = [89, 93];
  private static readonly PAD_RIGHT_RANG: TypeRange = [93, 97];
  private static readonly PAD_TOP_RANG: TypeRange = [97, 101];
  private static readonly PAD_BOTTOM_RANG: TypeRange = [101, 105];
  private readonly buff: Buffer;

  constructor(buff: Buffer) {
    this.buff = buff;
  }

  // 读取 buff 区间
  private readBuffByRange(range: TypeRange): Buffer {
    return this.buff.slice(...range);
  }

  // 读取一个字节
  private readByte(offset: number) {
    return this.buff.readUInt8(offset);
  }

  // 读取一个 int
  private readInt(offset: number): number {
    const byte = this.readBuffByRange([offset, offset + 4]);
    if (byte.length !== 4) {
      throw new Error(`${byte} length must be 4.`);
    }
    const [ch1, ch2, ch3, ch4] = byte;
    return (ch1 << 24) + (ch2 << 16) + (ch3 << 8) + (ch4 << 0);
  }

  // 从 buffer 文件签名检测是否是 png
  isPNG(): boolean {
    // console.log(
    //   this.readBuffByRange(NinePatch.PNG_RANGE),
    //   NinePatch.PNG_IDENTIFIER
    // );
    return this.readBuffByRange(NinePatch.PNG_RANGE).equals(NinePatch.PNG_IDENTIFIER);
  }

  // 检测是否包含 .9 图必要数据块 npTc && npOl
  isNinePatch(): boolean {
    const {
      npTc_RANGE, //
      npOl_RANGE,
      npTc_IDENTIFIER,
      npOl_IDENTIFIER
    } = NinePatch;
    return (
      this.readBuffByRange(npTc_RANGE).equals(npTc_IDENTIFIER) &&
      this.readBuffByRange(npOl_RANGE).equals(npOl_IDENTIFIER)
    );
  }

  hasIHDR(): boolean {
    const { IHDR_RANGE, IHDR_IDENTIFIER } = NinePatch;
    return this.readBuffByRange(IHDR_RANGE).equals(IHDR_IDENTIFIER);
  }

  getSize(): { width: number; height: number } {
    /**
     * 数据块包含了图片所有的数据，一个数据块可以分为数据块的开始信息、数据块的数据信息和数据块的结束信息。
     * 一个数据块的开始信息包含 2 个 32 位的数字，换算成字节的话，就是 8 个字节。前 4 个字节会被合并成一个 32 位的数字，表示数据信息的长度，后面 4 个字节可以被转换成文本，表示数据块的类型。
     * 我们从第 8 个字节开始解析数据块的开始信息。
     */
    // // IHDR
    // const IHDR = [];
    // for (let i = 0; i < this.IHDR_LENGTH; i++) {
    //   IHDR.push(this.readByte(this.IHDR_OFFSET + i));
    // }
    // console.log(3, { IHDR, isIHDR: Buffer.from(IHDR).slice(4).toString() === "IHDR" })

    // IHDR DATA
    const IHDR_DATA = {
      bytLength: this.readInt(NinePatch.IHDR_LENGTH_RANGE[0]),
      width: this.readInt(NinePatch.IHDR_WIDTH_RANGE[0]),
      height: this.readInt(NinePatch.IHDR_HEIGHT_RANGE[0]),
      /**
       * depth （通道深度）代表每个色彩通道用几位数据表示。
       * 一张 PNG 图片是由像素组成的，每个像素由色彩通道组成，每个色彩通道又是由位来组成。
       */
      depth: this.readByte(NinePatch.IHDR_DEPTH_INDEX),
      /**
       * colorType（色彩类型）PNG 图片一共有 5 种色彩类型
       * 0 代表灰度颜色
       * 2 代表用 RGB 表示颜色，即 (R, G, B)
       * 3 代表用色板表示颜色
       * 4 代表灰度和透明度来表示颜色
       * 6 代表用 RGB 和透明度表示颜色，即 (R, G, B, A)。色板的色彩类型里，每个像素是由 1 个色彩通道表示的。
       */
      colorType: this.readByte(NinePatch.IHDR_COLOR_TYPE_INDEX),
      /**
       * compression 代表了压缩算法。
       * 目前只支持 0，表示 deflate/inflate。Deflate/inflate
       * 是一种结合了 LZ77 和霍夫曼编码的无损压缩算法，被广泛运用于 7-zip，zlib，gzip 等场景。
       */
      compression: this.readByte(NinePatch.IHDR_COMPRESSION_INDEX),
      /**
       * filter 代表在压缩前应用的过滤函数类型，目前只支持 0。过滤函数类型 0 里面包括了 5 种过滤函数。
       */
      filter: this.readByte(NinePatch.IHDR_FILTER_INDEX),
      /**
       * interlace 代表图片数据是否经过交错，0 代表没有交错，1 代表交错。
       */
      interlace: this.readByte(NinePatch.IHDR_INTERLACE_INDEX)
    };
    // console.log(4, { IHDR_DATA });
    return {
      width: IHDR_DATA.width,
      height: IHDR_DATA.height
    };
  }

  /**
   * 解码 .9 信息
   * @returns
   */
  decode(): TypeNinePatchData {
    if (!this.isPNG()) {
      throw new Error("buffer is not a png.");
    }
    if (!this.isNinePatch()) {
      throw new Error("buffer is not a nine patch");
    }

    const xDivCount = this.readByte(NinePatch.X_DIVS_INDEX);
    const yDivCount = this.readByte(NinePatch.Y_DIVS_INDEX);
    const Y_DIVS_OFFSET = NinePatch.X_DIVS_OFFSET + xDivCount * 4;
    const NINE_PATCH_DATA: TypeNinePatchData = {
      padLeft: this.readInt(NinePatch.PAD_LEFT_RANG[0]),
      padRight: this.readInt(NinePatch.PAD_RIGHT_RANG[0]),
      padTop: this.readInt(NinePatch.PAD_TOP_RANG[0]),
      padBottom: this.readInt(NinePatch.PAD_BOTTOM_RANG[0]),
      xDivs: [],
      yDivs: []
    };
    for (let i = 0; i < xDivCount; i++) {
      NINE_PATCH_DATA.xDivs.push(this.readInt(NinePatch.X_DIVS_OFFSET + i * 4));
    }
    for (let i = 0; i < yDivCount; i++) {
      NINE_PATCH_DATA.yDivs.push(this.readInt(Y_DIVS_OFFSET + i * 4));
    }
    return NINE_PATCH_DATA;
  }

  /**
   * 编码 .9 信息
   * @deprecated 暂未实现
   * @param ninePatch
   * @returns
   */
  encode(ninePatch: TypeNinePatchData): Buffer {
    // TODO
    return Buffer.alloc(0);
  }
}

export default class NinePatchUtil {
  private static suffix = ".9.png";
  // 读取缓存
  static readCache(dir = PathUtil.NINEPATCH_TEMPORARY): Record<string, { getBuffer: () => Buffer }> {
    const record: Record<string, { getBuffer: () => Buffer }> = {};
    dirTree(dir, {}, file => {
      if (!file.name.endsWith(".9.png")) {
        return;
      }
      const fileMd5 = file.name.replace(/\.9\.png$/, "");
      record[fileMd5] = {
        getBuffer: () => fileCache.getBuffer(file.path)
      };
    });
    return record;
  }

  // 检测 ninePatch 数据块
  static isNinePatch(buff: Buffer): boolean {
    return new NinePatch(buff).isNinePatch();
  }

  // 编码 .9，从文件输出到文件
  static async encode9PatchWithFile(from: string, to: string): Promise<void> {
    const { AAPT_TOOL } = PathUtil;
    if (!AAPT_TOOL) {
      throw new Error(`未知系统类型：${os.type()}`);
    }
    return new Promise<void>(async (resolve, reject) => {
      childProcess.execFile(AAPT_TOOL, ["s", "-i", from, "-o", to], (err, stdout, stderr) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  // 编码 .9 目录输出到新的目录
  static async encode9patchWithDir(fromDir: string, toDir: string): Promise<void> {
    const { AAPT_TOOL } = PathUtil;
    if (!AAPT_TOOL) {
      throw new Error(`未知系统类型：${os.type()}`);
    }
    return new Promise((resolve, reject) => {
      const worker = childProcess.execFile(AAPT_TOOL, ["c", "-S", fromDir, "-C", toDir], (err, stdout, stderr) => {
        if (err) reject(err);
        console.log(`aapt[${worker.pid}]`, `处理完毕`);
        resolve();
      });
      console.log(`aapt[${worker.pid}]`, `处理 ${fse.readdirSync(fromDir).length} 个文件`);
    });
  }

  // 批量编码 .9，从文件夹到文件夹
  static async encodeNinePatchBatchDir(fromDir: string, toDir: string): Promise<void> {
    const { AAPT_TOOL } = PathUtil;
    if (!AAPT_TOOL) {
      throw new Error(`未知系统类型：${os.type()}`);
    }
    // TODO 目前是粗暴按照文件目录分配进程数，可优化按照实际资源平均分配
    const dirs = fse.readdirSync(fromDir);
    const task = dirs.map(targetDir => {
      console.log("开启一个进程处理: ", targetDir);
      return new Promise<void>(async (resolve, reject) => {
        const from = path.join(fromDir, targetDir);
        const to = path.join(toDir, targetDir);
        childProcess.execFile(AAPT_TOOL, ["c", "-S", from, "-C", to], (err, stdout, stderr) => {
          if (err) reject(err);
          console.log("进程处理完毕", targetDir);
          resolve();
        });
      });
    });
    await Promise.all(task);
  }

  // 编码 .9 传入绝对路径或者 buffer，将会返回编码后的 buffer
  static async encode9patch(data: string): Promise<Buffer>;
  static async encode9patch(data: Buffer): Promise<Buffer>;
  static async encode9patch(data: string | Buffer): Promise<Buffer> {
    // 生成 id 标识
    const uuid = md5(data);
    // 临时文件路径
    let temp = "";
    // 缓存文件
    const to = path.join(PathUtil.NINEPATCH_TEMPORARY, `${uuid}.9.png`);

    // 若传入为 buffer 类型，则需要先写入文件
    // 因为目前使用 aapt 进行编码 .9 信息
    if (Buffer.isBuffer(data)) {
      temp = path.join(PathUtil.NINEPATCH_TEMPORARY, `__temp__${uuid}.9.png`);
      fse.writeFileSync(temp, data);
    } else if (typeof data === "string") {
      // 判断文件是否存在
      if (!fse.existsSync(data)) {
        throw new Error(`[encode9patch] '${data}' should be a exists path`);
      }
      temp = data;
    } else {
      throw new Error("[encode9patch] data should be absolute path or buffer");
    }
    // 使用 aapt 编码 .9 图片文件
    await NinePatchUtil.encode9PatchWithFile(temp, to);

    // 返回 buffer
    return fse.readFileSync(to);
  }

  /**
   * 批量 encode .9 信息
   * 使用多进程技术分配处理
   * @param files
   * @returns
   */
  static async encode9patchBatch(files: string[]): Promise<void> {
    return $workers.ninePatch.encodeBatch(files);
  }
}
