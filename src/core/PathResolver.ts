import path from "path";
import { placeholderRegexp } from "../common/regexp";
import { PLACEHOLDER } from "../enum";
// import PATHS_CONFIG from "../server/utils/pathUtils";

export default class PathResolver {
  // 格式化模板字符串
  // ${source}/path/to/xxx -> path.join(this.sourceRoot, 'path/to/xxx')
  static parse(
    data: Partial<Record<PLACEHOLDER, string>>,
    pathname: string
  ): string {
    let result = pathname;
    const execResult = placeholderRegexp.exec(result);
    if (!execResult) return result;
    const matched = execResult[0];
    const placeholder = execResult[1] as PLACEHOLDER;
    const value = placeholder && data[placeholder];
    if (value) result = result.replace(matched, value);
    return path.normalize(PathResolver.parse(data, result));
  }
}
