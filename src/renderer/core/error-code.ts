const ERR_CODE = {
  // 工程相关
  2000: "创建工程出错",
  2001: "工程不存在",
  2002: "创建失败，无 uiVersion 信息",
  2003: "写入工程数据失败",
  2004: "未找到工程信息",

  // 模板相关
  3000: "页面配置文件不存在",
  3001: "模板版本信息错误",
  3002: "获取模板错误",
  3003: "页面预览配置读取失败",
  3004: "未选择UI版本",
  3005: "未找到模板描述文件",
  3006: "目标资源配置为空",

  // 资源相关
  4000: "图片路径为空",
  4001: "图片文件不存在或未知图片格式",
  4002: "图片加载失败"
};

export default ERR_CODE;
