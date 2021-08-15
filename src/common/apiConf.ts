import { ElectronPathCollection } from "src/data/AppPath";
import { TypeReleaseXmlTempPayload } from "../types/request";
import {
  TypeCreateProjectPayload,
  TypeProjectData,
  TypeProjectInfo,
  TypeProjectUiVersion
} from "../types/project";
import { TypePathConfig } from "../types/extraConfig";

type TypeApiConf<T, Q extends string[]> = Readonly<{
  url: string;
  params: string[];
  query: Q;
  bodyKeys: T extends Record<string, unknown> ? Array<keyof T> : string[];
  body: T;
}>;

function createApiConf<T, Q extends string[], K extends Q[number]>(
  obj: Partial<TypeApiConf<T, Array<K>>>
): Required<TypeApiConf<T, Array<K>>> {
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
  // 交换前后端路径配置信息
  SWOP_PATH_CONFIG: createApiConf({
    url: "/path/config/swop",
    bodyKeys: Object.keys(new ElectronPathCollection().create()) as [
      ...Array<keyof TypePathConfig>
    ],
    body: {} as TypePathConfig
  }),

  /**
   * @deprecated
   * 获取 sourceConfig 路径
   */
  GET_PATH_CONFIG: createApiConf({
    url: "/path/config"
  }),
  // 图片服务
  IMAGE: createApiConf({
    url: "/image",
    query: ["filepath"]
    // body: Buffer.from("")
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
    query: ["namespace", "config"]
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
  // 获取页面配置的素材文件数据
  GET_PAGE_SOURCE_DATA: createApiConf({
    url: "/project/source",
    params: ["uuid"],
    query: ["config"]
  }),
  // 获取一个文件的数据
  GET_SOURCE_FILE_DATA: createApiConf({
    url: "/project/file",
    params: ["uuid"],
    query: ["filepath"]
  }),

  // 按行写入 xml
  XML_TEMPLATE_WRITE: createApiConf({
    url: "/project/xml/template/write",
    query: ["uuid"],
    bodyKeys: ["name", "value", "src"],
    body: {} as TypeReleaseXmlTempPayload
  }),
  // 通过 name 查找工程的 value
  GET_XML_TEMP_VALUE: createApiConf({
    url: "/project/xml/value",
    query: ["uuid", "name", "src"]
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
    url: "/project/pack",
    query: ["uuid"]
  }),
  // 工程解包
  UNPACK_PROJECT: createApiConf({
    url: "/project/unpack"
  }),
  // 应用到手机
  APPLY_PROJECT: createApiConf({
    url: "/project/apply"
  })
} as const;

export default API;
