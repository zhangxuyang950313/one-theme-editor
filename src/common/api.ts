enum API {
  // 获取 sourceConfig 路径
  GET_PATH_CONFIG = "/path",
  // 图片服务
  IMAGE = "/image",
  // 获取图片数据
  IMAGE_DATA = "/image/data",

  // 获取厂商信息列表
  GET_BRAND_LIST = "/brand/list",
  // 获取配置简略信息列表
  GET_SOURCE_DESC_LIST = "/source/description/list",
  // 获取模板配置
  GET_SOURCE_CONF_DATA = "/source/config/data",

  // 获取资源配置结构数据
  GET_SOURCE_MODULE_LIST = "/source/description/module/list",

  GET_SOURCE_PAGE_CONFIG = "/source/config/page/data",

  // 创建工程
  CREATE_PROJECT = "/project/create",
  // 更新工程
  UPDATE_PROJECT = "/project/update",
  // 更新描述信息
  UPDATE_DESCRIPTION = "/project/update/description",
  // 更新UI版本信息
  UPDATE_UI_VERSION = "/project/update/ui-version",
  // 获取工程列表
  GET_PROJECT_LIST = "/project/list",
  // 通过 id 获取工程信息
  GET_PROJECT = "/project",

  // 复制文件
  COPY_FILE = "/file/copy",
  // 写入本地文件
  WRITE_FILE = "/file/write",
  // 删除本地文件
  DELETE_FILE = "/file/delete"
}
export default API;
