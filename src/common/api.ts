import {
  TypeCreateProjectPayload,
  TypeProjectData,
  TypeProjectInfo,
  TypeProjectUiVersion
} from "src/types/project";
import { TypeReleaseXmlTempPayload } from "src/types/request";

const API = {
  // 初始化，后端设置 cookies
  INIT: {
    url: "/init",
    body: {} as Record<string, string>
  },
  // 获取 sourceConfig 路径
  GET_PATH_CONFIG: "/path/config",
  // 图片服务
  IMAGE: {
    url: "/image",
    query: ["filepath"],
    body: Buffer.from("")
  },
  // 获取图片数据
  IMAGE_DATA: "/image/data",

  /**
   * 获取资源配置数据
   */
  // 获取厂商信息列表
  GET_BRAND_LIST: "/brand/list",
  // 获取配置信息列表
  GET_SOURCE_CONF_LIST: {
    url: "/source/config/list",
    params: ["brandType"]
  },
  // 获取模板配置数据
  GET_SOURCE_CONF_DATA: {
    url: "/source/config/data",
    query: ["config"]
  },
  // 获取配置模块列表
  GET_SOURCE_CONF_MODULE_LIST: {
    url: "/source/config/module/list",
    query: ["config"]
  },
  // 获取配置页面数据
  GET_SOURCE_CONF_PAGE_DATA: {
    url: "/source/config/page/data",
    query: ["config"]
  },

  // 创建工程
  CREATE_PROJECT: {
    url: "/project/create",
    body: {} as TypeCreateProjectPayload
  },
  // 更新工程
  UPDATE_PROJECT: {
    url: "/project/update",
    body: {} as Partial<TypeProjectData>
  },
  // 更新描述信息
  UPDATE_PROJECT_INFO: {
    url: "/project/update/info",
    params: ["uuid"],
    body: {} as TypeProjectInfo
  },
  // 更新UI版本信息
  UPDATE_UI_VERSION: {
    url: "/project/update/ui-version",
    params: ["uuid"],
    body: {} as TypeProjectUiVersion
  },
  // 获取工程列表
  GET_PROJECT_LIST: {
    url: "/project/list",
    params: ["brandType"]
  },
  // 通过 id 获取工程信息
  GET_PROJECT: {
    url: "/project/get",
    params: ["uuid"]
  },

  // 输出 xml 模板
  XML_TEMPLATE_RELEASE: {
    url: "/project/xml/template/release",
    query: ["uuid"],
    bodyKeys: ["key", "value", "template", "releaseXml"] as Array<
      keyof TypeReleaseXmlTempPayload
    >,
    body: {} as TypeReleaseXmlTempPayload
  },
  // 通过 name 查找工程的 value
  GET_XML_TEMP_VALUE: {
    url: "/project/xml/value",
    query: ["uuid", "name", "releaseXml"]
  },

  // 复制文件
  COPY_FILE: {
    url: "/file/copy",
    bodyKeys: ["from", "to"]
  },
  // 写入本地文件
  WRITE_FILE: "/file/write",
  // 删除本地文件
  DELETE_FILE: {
    url: "/file/delete",
    bodyKeys: ["file"]
  },

  // 工程打包
  PACK_PROJECT: "/tools/project/pack",
  // 工程解包
  UNPACK_PROJECT: "/tools/project/unpack",
  // 应用到手机
  APPLY_PROJECT: "/tools/project/apply"
} as const;

export default API;
