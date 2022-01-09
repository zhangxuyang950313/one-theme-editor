export default class RegexpUtil {
  // url
  static urlRegexp = /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/;
  // xml 模板占位符
  static placeholderRegexp = /^\${(.+?)}/;
  // 模板字符串
  static tempStrRegexp = /\${(.+?)}/g;
  // 占位符工程目录开头
  static projectPrefixRegexp = /^\$\{project\}/;
  // hex 3位颜色值
  static hex3Regexp = /^#([a-fA-F\d]{3})$/;
  // hex 4位颜色值
  static hex4Regexp = /^#([a-fA-F\d]{4})$/;
  // hex 6位颜色值
  static hex6Regexp = /^#([a-fA-F\d]{6})$/;
  // hex 8位颜色值
  static hex8Regexp = /^#([a-fA-F\d]{8})$/;
  // hex 所有匹配颜色
  static hexRegexp = /^#([a-fA-F\d]{3}|[a-fA-F\d]{4}|[a-fA-F\d]{6}|[a-fA-F\d]{8})$/;

  static extOf9Patch = /\.9\.png$/;
}
