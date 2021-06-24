enum ACTION_TYPES {
  // 设置服务端口
  SET_SERVER_PORT = "SET_SERVER_PORT",

  // 设置厂商品牌列表
  SET_BRAND_LIST = "SET_BRAND_LIST",
  // 设置当前选择的厂商
  SET_SELECTED_BRAND = "SET_SELECTED_BRAND",

  // 初始化工程信息
  INIT_PROJECT = "INIT_PROJECT",
  // 设置工程新数据
  SET_PROJECT_DATA = "SET_PROJECT_DATA",
  // 设置工程描述数据
  SET_PROJECT_DESCRIPTION = "SET_PROJECT_DESCRIPTION",

  // 设置当前模板信息
  SET_CURRENT_TEMPLATE = "SET_CURRENT_TEMPLATE",
  // 设置当前选择的模块信息
  SET_CURRENT_MODULE = "SET_CURRENT_MODULE",
  // 设置当前选择的页面信息
  SET_CURRENT_PAGE = "SET_CURRENT_PAGE",

  // 设置 store.project.imageMapperList
  SET_IMAGE_MAPPER_LIST = "SET_IMAGE_MAPPER_LIST"
}

export default ACTION_TYPES;
