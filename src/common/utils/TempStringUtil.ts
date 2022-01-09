import RegexpUtil from "src/common/utils/RegexpUtil";

// 模板字符串处理
export default class TempStringUtil {
  // match 出所有要替换的列表
  // [["${project_name}", project_name]]
  static match(content: string): Array<[string, string]> {
    const result: Array<[string, string]> = [];
    let m: RegExpExecArray | null;
    const regexp = new RegExp(RegexpUtil.tempStrRegexp);
    while ((m = regexp.exec(content)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regexp.lastIndex) {
        regexp.lastIndex++;
      }
      result.push([m[0], m[1]]);
    }
    return result;
  }

  // 替换模板字符串
  static replace(content: string, data: Map<string, string>): string {
    return TempStringUtil.match(content).reduce(
      (prev, [temp, variable]) => prev.replace(temp, data.get(variable) ?? ""),
      content
    );
  }

  // 借力 eval 计算模板字符串，这个需要确保变量为标准 js 变量命名，否则会报错
  static eval(content: string, data: Record<string, string>): string {
    const varDefine = Object.keys(data).reduce((prev, key) => (prev += `const ${key} = "${data[key]}";\n`), "");
    // eslint-disable-next-line no-eval
    return eval(`${varDefine} \`${content}\`;`);
  }
}
