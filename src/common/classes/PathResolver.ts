import path from "path";

import { PLACEHOLDER } from "../enums/index";
import RegexpUtil from "../utils/RegexpUtil";
// import PATHS_CONFIG from "../types/config.extra";

export default class PathResolver {
  // 格式化模板字符串
  // ${resource}/path/to/xxx -> path.join(this.sourceRoot, 'path/to/xxx')
  static parse(
    data: Partial<Record<PLACEHOLDER | string, string>>,
    pathname: string
  ): string {
    let result = pathname;
    const execResult = RegexpUtil.placeholderRegexp.exec(result);
    if (!execResult) return path.normalize(result);
    const matched = execResult[0];
    const placeholder = execResult[1];
    const value = placeholder && data[placeholder];
    result = result.replace(matched, value || "");
    return PathResolver.parse(data, result);
  }
}
