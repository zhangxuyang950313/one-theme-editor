import path from "path";
import { placeholderRegexp } from "src/common/regexp";
import { PLACEHOLDER } from "src/enum/index";
// import PATHS_CONFIG from "../types/extraConfig";

export default class PathResolver {
  // 格式化模板字符串
  // ${source}/path/to/xxx -> path.join(this.sourceRoot, 'path/to/xxx')
  static parse(
    data: Partial<Record<PLACEHOLDER | string, string>>,
    pathname: string
  ): string {
    let result = pathname;
    const execResult = placeholderRegexp.exec(result);
    if (!execResult) return path.normalize(result);
    const matched = execResult[0];
    const placeholder = execResult[1];
    const value = placeholder && data[placeholder];
    result = result.replace(matched, value || "");
    return PathResolver.parse(data, result);
  }
}
