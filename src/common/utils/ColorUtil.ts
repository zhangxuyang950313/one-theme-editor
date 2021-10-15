import rgb2hex from "rgb-hex";
import hex2rgb, { RgbaObject } from "hex-rgb";
import { HEX_FORMAT } from "src/enum/index";
import RegexpUtil from "src/common/utils/RegexpUtil";

export { HEX_FORMAT };

type TypeHexStr = `#${string}`;
type TypeRGBAStr = `rgba(${number}, ${number}, ${number}, ${number})`;

class RGBAColorUtil {
  private rgbObj: RgbaObject;
  constructor(rgbObj: RgbaObject) {
    const keyList = ["red", "green", "blue", "alpha"];
    const keySet = new Set(Object.keys(rgbObj));
    if (!keyList.every(keySet.has.bind(keySet))) {
      throw new Error(`输入格式不正确，需要包含key ${keyList}`);
    }
    this.rgbObj = rgbObj;
  }

  // 格式化 rgba 数据 为 hex 颜色字符串
  format(format: HEX_FORMAT): TypeHexStr {
    const { red, green, blue, alpha } = this.rgbObj;
    const duty = {
      get [HEX_FORMAT.RGB](): TypeHexStr {
        return `#${rgb2hex(red, green, blue)}`;
      },
      get [HEX_FORMAT.RGBA](): TypeHexStr {
        return `#${rgb2hex(red, green, blue, alpha)}`;
      },
      get [HEX_FORMAT.ARGB](): TypeHexStr {
        let alp = Math.round(alpha * 255).toString(16);
        if (Number(`0x${alp}`) < 0xa) alp = `0${alp}`;
        return `#${alp}${rgb2hex(red, green, blue)}`;
      }
    };
    const list = Object.keys(duty);
    if (!new Set(list).has(format)) {
      throw new Error(`${format} 不是可用格式。可用格式： "${list}"`);
    }
    return duty[format];
  }
}

class ColorUtil {
  private hexColor: string;
  private hexFormat: HEX_FORMAT;
  /**
   * 要明确指定传入 hex 的格式
   * @param color
   * @param type
   */
  constructor(color: string, colorFormat: HEX_FORMAT);
  constructor(color: TypeHexStr, colorFormat: HEX_FORMAT) {
    this.hexColor = color;
    this.hexFormat = colorFormat;
    this.checkout();
  }

  static isUnit6Hex(str: string): boolean {
    return RegexpUtil.hex6Regexp.test(str);
  }

  static isUnit8Hex(str: string): boolean {
    return RegexpUtil.hex8Regexp.test(str);
  }

  static isHex(str: string): boolean {
    return RegexpUtil.hexRegexp.test(str);
  }

  static create(hex: string, format: HEX_FORMAT): ColorUtil {
    return new ColorUtil(hex, format);
  }

  /**
   * 创建一个纯白色
   */
  static createWhite(): ColorUtil {
    return new ColorUtil("#ffffffff", HEX_FORMAT.RGBA);
  }

  /**
   * 创建一个纯黑色
   * @returns
   */
  static createBlack(): ColorUtil {
    return new ColorUtil("#000000ff", HEX_FORMAT.RGBA);
  }

  /**
   * 创建一个黑色全透明色
   * @returns
   */
  static createTransparent(): ColorUtil {
    return new ColorUtil("#00000000", HEX_FORMAT.RGBA);
  }

  static rgba(rgba: RgbaObject): ColorUtil {
    const hex = new RGBAColorUtil(rgba).format(HEX_FORMAT.RGBA);
    return new ColorUtil(hex, HEX_FORMAT.RGBA);
  }

  checkout(): this {
    if (
      ([HEX_FORMAT.ARGB, HEX_FORMAT.RGBA].includes(this.hexFormat) &&
        !ColorUtil.isUnit8Hex(this.hexColor)) ||
      (this.hexFormat === HEX_FORMAT.RGB &&
        !ColorUtil.isUnit6Hex(this.hexColor))
    ) {
      throw new Error(`"${this.hexColor}" 非 "${this.hexFormat}" 格式颜色`);
    }
    return this;
  }

  /**
   * 获取 rgba 数据
   * @returns
   */
  getRGBA(): RgbaObject {
    /**
     * hex2rgb 解析为 rgba 格式
     * argb 需要将 alpha 挪到前面
     */
    if (this.hexFormat === HEX_FORMAT.ARGB) {
      const [alpha, red, green, blue] = hex2rgb(this.hexColor, {
        format: "array"
      });
      return { alpha: alpha / 255, red, green, blue: blue * 255 };
    }
    return hex2rgb(this.hexColor, { format: "object" });
  }

  /**
   * 获取 CSS HEX 颜色
   * @returns
   */
  getCssHex(): TypeHexStr {
    return this.format(HEX_FORMAT.RGBA);
  }

  /**
   * 获取 CSS RGBA 颜色
   * @returns
   */
  getCssRGBA(): TypeRGBAStr {
    const { red, green, blue, alpha } = this.getRGBA();
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }

  /**
   * 格式化当前实例 rgb 为 hex
   * @param format
   * @returns
   */
  format(format: HEX_FORMAT): TypeHexStr {
    return new RGBAColorUtil(this.getRGBA()).format(format);
  }
}

export default ColorUtil;
