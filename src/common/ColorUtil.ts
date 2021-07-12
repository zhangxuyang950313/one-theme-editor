import rgb2hex from "rgb-hex";
import hex2rgb, { RgbaObject } from "hex-rgb";
import { hexRegexp, hex6Regexp, hex8Regexp } from "./regexp";

export enum HEX_TYPES {
  RGBA = "rgba",
  ARGB = "argb",
  RGB = "rgb"
}

class ColorUtil {
  private hex: string;
  private hexType: HEX_TYPES;
  /**
   * 要明确指定传入 hex 的格式
   * @param hex
   * @param type
   */
  constructor(hex: string, type: HEX_TYPES) {
    if (!ColorUtil.isHex(hex)) {
      throw new Error(`"${hex}" 不是合法颜色值`);
    }
    this.hex = hex;
    this.hexType = type;
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
   * 创建一个黑色全透明的 rgb 数据
   * @returns
   */
  static createTransparent(): RgbaObject {
    return { alpha: 0, red: 0, green: 0, blue: 0 };
  }

  /**
   * 格式化 rgba 数据 为 hex 颜色字符串
   * @param rgba
   * @param format
   * @returns
   */
  static rgbaFormat(rgba: RgbaObject, format: HEX_TYPES): string {
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
   * 获取 rgba 数据
   * @returns
   */
  getRgbaData(): RgbaObject {
    /**
     * hex2rgb 解析为 rgba 格式
     * argb 需要将 alpha 挪到前面
     */
    if (this.hexType === HEX_TYPES.ARGB) {
      const [alpha, red, green, blue] = hex2rgb(this.hex, { format: "array" });
      return { alpha: alpha / 255, red, green, blue: blue * 255 };
    }
    return hex2rgb(this.hex, { format: "object" });
  }

  /**
   * 格式化当前实例 rgb 为 hex
   * @param format
   * @returns
   */
  format(format: HEX_TYPES): string {
    return ColorUtil.rgbaFormat(this.getRgbaData(), format);
  }
}

export default ColorUtil;
