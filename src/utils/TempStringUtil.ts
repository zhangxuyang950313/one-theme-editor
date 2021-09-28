import { tempStrRegexp } from "src/common/regexp";

// 模板字符串处理
export default class TempStringUtil {
  // match 出所有要替换的列表
  // [["${project_name}", project_name]]
  static match(content: string): Array<[string, string]> {
    const result: Array<[string, string]> = [];
    let m: RegExpExecArray | null;
    while ((m = tempStrRegexp.exec(content)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === tempStrRegexp.lastIndex) {
        tempStrRegexp.lastIndex++;
      }
      result.push([m[0], m[1]]);
    }
    return result;
  }

  // 替换模板字符串
  static replace(content: string, data: Record<string, string>): string {
    return TempStringUtil.match(content).reduce(
      (prev, [temp, variable]) => prev.replace(temp, data[variable] ?? ""),
      content
    );
  }
}
