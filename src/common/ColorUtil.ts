import rgb2hex from "rgb-hex";
import hex2rgb, { RgbaObject } from "hex-rgb";
import { hexRegexp, hex6Regexp, hex8Regexp } from "./regexp";

export enum EnumHexFormat {
  RGBA = "rgba",
  ARGB = "argb",
  RGB = "rgb"
}

class ColorUtil {
  private rgba: RgbaObject;
  constructor(rgba: RgbaObject) {
    this.rgba = rgba;
  }

  static isUnit6Hex(str: string): boolean {
    return hex6Regexp.test(str);
  }

  static isUnit8Hex(str: string): boolean {
    return hex8Regexp.test(str);
  }

  static isHex(str: string): boolean {
    return hexRegexp.test(str);
  }

  /**
   * rgba 数据格式化字符串颜色
   * @param format
   * @returns
   */
  static rgbaFormat(rgba: RgbaObject, format: EnumHexFormat): string {
    const keyList = ["red", "green", "blue", "alpha"];
    const keySet = new Set(Object.keys(rgba));
    if (!keyList.every(keySet.has.bind(keySet))) {
      throw new Error(`输入格式不正确，需要包含key ${keyList}`);
    }
    const { red, green, blue, alpha } = rgba;
    const duty = {
      rgb: () => `#${rgb2hex(red, green, blue)}`,
      rgba: () => `#${rgb2hex(red, green, blue, alpha)}`,
      argb: () =>
        `#${Math.round(alpha * 255).toString(16)}${rgb2hex(red, green, blue)}`
    };
    const list = Object.keys(duty);
    if (!new Set(list).has(format)) {
      throw new Error(`${format} 不是可用格式。可用格式： "${list}"`);
    }
    return duty[format]();
  }

  /**
   * hex 格式互转
   * @param hex
   * @param format
   */
  static hexFormat(
    hex: string,
    format: EnumHexFormat.ARGB | EnumHexFormat.RGBA
  ): string {
    // rgb 情况
    if (ColorUtil.isUnit6Hex(hex)) {
      return ColorUtil.rgbaFormat(hex2rgb(hex, { format: "object" }), format);
    }
    /**
     * rgba 或 argb 情况，取决于和目标相反的格式
     * 这要求调用方要清楚知道传入的格式
     */
    if (ColorUtil.isUnit8Hex(hex)) {
      // hex 为 rgba 情况
      if (format === EnumHexFormat.ARGB) {
        return ColorUtil.rgbaFormat(ColorUtil.compileRgbaHex(hex), format);
      }
      // hex 为 argb 情况
      if (format === EnumHexFormat.RGBA) {
        return ColorUtil.rgbaFormat(ColorUtil.compileArgbHex(hex), format);
      }
      throw new Error("format 只能为 rgba | argb");
    }
    throw new Error(`非法 hex 颜色格式：${hex}。请使用"#ffffff" | "#ffffffff"`);
  }

  // rgba hex 转换 rgbaObject
  static compileRgbaHex(hex: string): RgbaObject {
    if (!ColorUtil.isUnit8Hex(hex)) {
      throw new Error("非 8 位颜色值");
    }
    const [red, green, blue, alpha] = hex2rgb(hex, { format: "array" });
    return { red, green, blue, alpha };
  }

  // argb hex 转换 rgbaObject
  static compileArgbHex(hex: string): RgbaObject {
    const { red, green, blue, alpha } = ColorUtil.compileRgbaHex(hex);
    return { red: alpha, green: red, blue: green, alpha: blue };
  }

  /**
   * 创建一个纯白色 rgba 数据
   */
  static createWhiteRgba(): RgbaObject {
    return hex2rgb("#ffffff", { format: "object" });
  }

  /**
   * 创建一个纯黑色 rgb 数据
   * @returns
   */
  static createBlackRgba(): RgbaObject {
    return hex2rgb("#000000", { format: "object" });
  }

  /**
   * 格式化当前实例 rgb 为 hex
   * @param format
   * @returns
   */
  format(format: EnumHexFormat): string {
    return ColorUtil.rgbaFormat(this.rgba, format);
  }
}

export default ColorUtil;
