type TypeRange = readonly [number, number];
type TypeNinePatchData = {
  padLeft: number;
  padRight: number;
  padTop: number;
  padBottom: number;
  xDivs: number[];
  yDivs: number[];
};
export default class NinePatchUtil {
  private readonly PNG_RANGE: TypeRange = [0, 8];
  private readonly PNG_IDENTIFIER = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a
  ]); // PNG 标识
  private readonly npTc_RANGE: TypeRange = [73, 77]; // npTc 区间
  private readonly npOl_RANGE: TypeRange = [37, 41]; // npOl 区间
  private readonly npTc_IDENTIFIER = Buffer.from([0x6e, 0x70, 0x54, 0x63]); // npTc 标识
  private readonly npOl_IDENTIFIER = Buffer.from([0x6e, 0x70, 0x4f, 0x6c]); // npOl 标识
  private readonly IHDR_OFFSET = 8; // IHDR 起点
  private readonly IHDR_LENGTH = 8; // IHDR 总长度
  private readonly IHDR_RANGE: TypeRange = [12, 16]; // IHDR 标识区间
  private readonly IHDR_IDENTIFIER = Buffer.from([0x49, 0x48, 0x44, 0x52]); // IHDR 标识
  private readonly IHDR_LENGTH_RANGE: TypeRange = [8, 12]; // IHDR 数据长度数据区间
  private readonly IHDR_WIDTH_RANGE: TypeRange = [16, 20]; // IHDR 图片宽度数据区间
  private readonly IHDR_HEIGHT_RANGE: TypeRange = [20, 24]; // IHDR 图片高度数据区间
  private readonly IHDR_DEPTH_INDEX = 24;
  private readonly IHDR_COLOR_TYPE_INDEX = 25;
  private readonly IHDR_COMPRESSION_INDEX = 26;
  private readonly IHDR_FILTER_INDEX = 27;
  private readonly IHDR_INTERLACE_INDEX = 28;
  private readonly X_DIVS_INDEX = 78;
  private readonly Y_DIVS_INDEX = 79;
  private readonly X_DIVS_OFFSET = 109;
  private readonly PAD_LEFT_RANG: TypeRange = [89, 93];
  private readonly PAD_RIGHT_RANG: TypeRange = [93, 97];
  private readonly PAD_TOP_RANG: TypeRange = [97, 101];
  private readonly PAD_BOTTOM_RANG: TypeRange = [101, 105];
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
    console.log(this.readBuffByRange(this.PNG_RANGE), this.PNG_IDENTIFIER);
    return this.readBuffByRange(this.PNG_RANGE).equals(this.PNG_IDENTIFIER);
  }

  // 检测是否包含 .9 图必要数据块 npTc && npOl
  isNinePatch(): boolean {
    return (
      this.readBuffByRange(this.npTc_RANGE).equals(this.npTc_IDENTIFIER) &&
      this.readBuffByRange(this.npOl_RANGE).equals(this.npOl_IDENTIFIER)
    );
  }

  hasIHDR(): boolean {
    return this.readBuffByRange(this.IHDR_RANGE).equals(this.IHDR_IDENTIFIER);
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
      bytLength: this.readInt(this.IHDR_LENGTH_RANGE[0]),
      width: this.readInt(this.IHDR_WIDTH_RANGE[0]),
      height: this.readInt(this.IHDR_HEIGHT_RANGE[0]),
      /**
       * depth （通道深度）代表每个色彩通道用几位数据表示。
       * 一张 PNG 图片是由像素组成的，每个像素由色彩通道组成，每个色彩通道又是由位来组成。
       */
      depth: this.readByte(this.IHDR_DEPTH_INDEX),
      /**
       * colorType（色彩类型）PNG 图片一共有 5 种色彩类型
       * 0 代表灰度颜色
       * 2 代表用 RGB 表示颜色，即 (R, G, B)
       * 3 代表用色板表示颜色
       * 4 代表灰度和透明度来表示颜色
       * 6 代表用 RGB 和透明度表示颜色，即 (R, G, B, A)。色板的色彩类型里，每个像素是由 1 个色彩通道表示的。
       */
      colorType: this.readByte(this.IHDR_COLOR_TYPE_INDEX),
      /**
       * compression 代表了压缩算法。
       * 目前只支持 0，表示 deflate/inflate。Deflate/inflate
       * 是一种结合了 LZ77 和霍夫曼编码的无损压缩算法，被广泛运用于 7-zip，zlib，gzip 等场景。
       */
      compression: this.readByte(this.IHDR_COMPRESSION_INDEX),
      /**
       * filter 代表在压缩前应用的过滤函数类型，目前只支持 0。过滤函数类型 0 里面包括了 5 种过滤函数。
       */
      filter: this.readByte(this.IHDR_FILTER_INDEX),
      /**
       * interlace 代表图片数据是否经过交错，0 代表没有交错，1 代表交错。
       */
      interlace: this.readByte(this.IHDR_INTERLACE_INDEX)
    };
    // console.log(4, { IHDR_DATA });
    return {
      width: IHDR_DATA.width,
      height: IHDR_DATA.height
    };
  }

  decode(): TypeNinePatchData {
    if (!this.isPNG()) {
      throw new Error("buffer is not a png.");
    }
    if (!this.isNinePatch()) {
      throw new Error("buffer is not a nine patch");
    }

    const xDivCount = this.readByte(this.X_DIVS_INDEX);
    const yDivCount = this.readByte(this.Y_DIVS_INDEX);
    const Y_DIVS_OFFSET = this.X_DIVS_OFFSET + xDivCount * 4;
    const NINE_PATCH_DATA: TypeNinePatchData = {
      padLeft: this.readInt(this.PAD_LEFT_RANG[0]),
      padRight: this.readInt(this.PAD_RIGHT_RANG[0]),
      padTop: this.readInt(this.PAD_TOP_RANG[0]),
      padBottom: this.readInt(this.PAD_BOTTOM_RANG[0]),
      xDivs: [],
      yDivs: []
    };
    for (let i = 0; i < xDivCount; i++) {
      NINE_PATCH_DATA.xDivs.push(this.readInt(this.X_DIVS_OFFSET + i * 4));
    }
    for (let i = 0; i < yDivCount; i++) {
      NINE_PATCH_DATA.yDivs.push(this.readInt(Y_DIVS_OFFSET + i * 4));
    }
    return NINE_PATCH_DATA;
  }

  /**
   * @deprecated 暂未实现
   * @param ninePatch
   * @returns
   */
  encode(ninePatch: TypeNinePatchData): Buffer {
    // TODO
    return Buffer.alloc(0);
  }
}
