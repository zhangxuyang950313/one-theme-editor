import {
  TypeCreateProjectPayload,
  TypeProjectData,
  TypeProjectInfo,
  TypeProjectUiVersion
} from "src/types/project";
import { TypeReleaseXmlTempPayload } from "src/types/request";

type TypeApiConf<T = unknown> = {
  readonly url: string;
  readonly params: string[];
  readonly query: string[];
  readonly bodyKeys: T extends Record<string, unknown>
    ? [...Array<keyof T>]
    : never[] | string[];
  readonly body: T;
};

function createApiConf<T>(
  obj: Partial<TypeApiConf<T>>
): Required<TypeApiConf<T>> {
  return {
    url: "",
    params: [],
    query: [],
    bodyKeys: [],
    body: {} as T,
    ...obj
  };
}

const API = {
  // 初始化，后端设置 cookies
  INIT: createApiConf<Record<string, string>>({
    url: "/init",
    body: {}
  }),
  // 获取 sourceConfig 路径
  GET_PATH_CONFIG: createApiConf({
    url: "/path/config"
  }),
  // 图片服务
  IMAGE: createApiConf({
    url: "/image",
    query: ["filepath"],
    body: Buffer.from("")
  }),
  // 获取图片数据
  IMAGE_DATA: createApiConf({
    url: "/image/data"
  }),

  /**
   * 获取资源配置数据
   */
  // 获取厂商信息列表
  GET_BRAND_LIST: createApiConf({
    url: "/brand/list"
  }),
  // 获取配置信息列表
  GET_SOURCE_CONF_LIST: createApiConf({
    url: "/source/config/list",
    params: ["brandType"]
  }),
  // 获取模板配置数据
  GET_SOURCE_CONF_DATA: createApiConf({
    url: "/source/config/data",
    query: ["config"]
  }),
  // 获取配置模块列表
  GET_SOURCE_CONF_MODULE_LIST: createApiConf({
    url: "/source/config/module/list",
    query: ["config"]
  }),
  // 获取配置页面数据
  GET_SOURCE_CONF_PAGE_DATA: createApiConf({
    url: "/source/config/page/data",
    query: ["config"]
  }),

  // 创建工程
  CREATE_PROJECT: createApiConf({
    url: "/project/create",
    body: {} as TypeCreateProjectPayload
  }),
  // 更新工程
  UPDATE_PROJECT: createApiConf({
    url: "/project/update",
    body: {} as Partial<TypeProjectData>
  }),
  // 更新描述信息
  UPDATE_PROJECT_INFO: createApiConf({
    url: "/project/update/info",
    params: ["uuid"],
    body: {} as TypeProjectInfo
  }),
  // 更新UI版本信息
  UPDATE_UI_VERSION: createApiConf({
    url: "/project/update/ui-version",
    params: ["uuid"],
    body: {} as TypeProjectUiVersion
  }),
  // 获取工程列表
  GET_PROJECT_LIST: createApiConf({
    url: "/project/list",
    params: ["brandType"]
  }),
  // 通过 id 获取工程信息
  GET_PROJECT: createApiConf({
    url: "/project/get",
    params: ["uuid"]
  }),

  // 输出 xml 模板
  XML_TEMPLATE_RELEASE: createApiConf({
    url: "/project/xml/template/release",
    query: ["uuid"],
    bodyKeys: ["key", "value", "template", "releaseXml"],
    body: {} as TypeReleaseXmlTempPayload
  }),
  // 通过 name 查找工程的 value
  GET_XML_TEMP_VALUE: createApiConf({
    url: "/project/xml/value",
    query: ["uuid", "name", "releaseXml"]
  }),

  // 复制文件
  COPY_FILE: createApiConf({
    url: "/file/copy",
    bodyKeys: ["from", "to"]
  }),
  // 写入本地文件
  WRITE_FILE: createApiConf({
    url: "/file/write"
  }),
  // 删除本地文件
  DELETE_FILE: createApiConf({
    url: "/file/delete",
    bodyKeys: ["file"]
  }),

  // 工程打包
  PACK_PROJECT: createApiConf({
    url: "/tools/project/pack"
  }),
  // 工程解包
  UNPACK_PROJECT: createApiConf({
    url: "/tools/project/unpack"
  }),
  // 应用到手机
  APPLY_PROJECT: createApiConf({
    url: "/tools/project/apply"
  })
} as const;

export default API;
