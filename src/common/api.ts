const API = {
  // 获取厂商信息列表
  GET_BRAND_LIST: "/brand/list",
  // 获取模板列表
  GET_TEMPLATE_LIST: "/template/list",
  // 获取模板配置
  GET_TEMPLATE_CONF: "/template/conf",
  // 创建工程
  CREATE_PROJECT: "/project/create",
  // 更新工程
  UPDATE_PROJECT: "/project/update",
  // 更新描述信息
  UPDATE_DESCRIPTION: "/project/update/description",
  // 更新UI版本信息
  UPDATE_UI_VERSION: "/project/update/ui-version",
  // 增加一个图片映射
  ADD_IMAGE_MAPPER: "/project/update/add-image-mapper",
  // 删除一个图片映射
  DEL_IMAGE_MAPPER: "/project/update/del-image-mapper",
  // 获取工程列表
  GET_PROJECT_LIST: "/project/list",
  // 通过 id 获取工程信息
  GET_PROJECT: "/project/get",
  // 复制文件
  COPY_FILE: "/file/copy",
  // 写入本地文件
  WRITE_FILE: "/file/write",
  // 删除本地文件
  DELETE_FILE: "/file/delete"
};
export default API;
