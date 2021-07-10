enum API {
  // 获取 sourceConfig 路径
  GET_PATH_CONFIG = "/path",
  // 图片服务
  IMAGE = "/image",
  // 获取图片数据
  IMAGE_DATA = "/image/data",

  /**
   * 获取资源配置数据
   */
  // 获取厂商信息列表
  GET_BRAND_LIST = "/brand/list",
  // 获取配置信息列表
  GET_SOURCE_CONF_LIST = "/source/config/list",
  // 获取模板配置数据
  GET_SOURCE_CONF_DATA = "/source/config/data",
  // 获取配置模块列表
  GET_SOURCE_CONF_MODULE_LIST = "/source/config/module/list",
  // 获取配置页面数据
  GET_SOURCE_CONF_PAGE_DATA = "/source/config/page/data",

  /**
   * 操作输出资源数据
   */
  // 输出 xml 模板
  OUTPUT_SOURCE_XML_TEMPLATE = "/source/xml/template/output",
  // 通过 name 查找工程的 value
  GET_PROJECT_XML_TEMP_VALUE = "/project/xml/value",

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
  GET_PROJECT = "/project/uuid",

  // 复制文件
  COPY_FILE = "/file/copy",
  // 写入本地文件
  WRITE_FILE = "/file/write",
  // 删除本地文件
  DELETE_FILE = "/file/delete",

  // 工程打包
  PACK_PROJECT = "/project/pack",
  // 工程解包
  UNPACK_PROJECT = "/project/unpack",
  // 应用到手机
  APPLY_PROJECT = "/project/apply"
}
export default API;
