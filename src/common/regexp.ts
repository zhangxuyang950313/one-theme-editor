// url
export const urlRegexp =
  /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/;

// xml 模板占位符
export const placeholderRegexp = /^\${(.+)}/;

// 占位符工程目录开头
export const projectPrefixRegexp = /^\$\{project\}/;

// hex 3位颜色值
export const hex3Regexp = /^#([a-fA-F\d]{3})$/;

// hex 4位颜色值
export const hex4Regexp = /^#([a-fA-F\d]{4})$/;

// hex 6位颜色值
export const hex6Regexp = /^#([a-fA-F\d]{6})$/;

// hex 8位颜色值
export const hex8Regexp = /^#([a-fA-F\d]{8})$/;

// hex 所有匹配颜色
export const hexRegexp =
  /^#([a-fA-F\d]{3}|[a-fA-F\d]{4}|[a-fA-F\d]{6}|[a-fA-F\d]{8})$/;
