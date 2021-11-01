import { ElectronPathCollection } from "src/data/PathCollection";
import { TypeWriteXmlTempPayload } from "src/types/request";
import {
  TypeCreateProjectPayload,
  TypeProjectData,
  TypeProjectDataDoc,
  TypeProjectInfo,
  TypeUiVersion
} from "src/types/project";
import { TypePathCollection } from "src/types/extraConfig";

type TypeApiConf<T, Q extends string[]> = Readonly<{
  path: string;
  params: Q;
  query: Q;
  bodyKeys: T extends Record<string, unknown> ? Array<keyof T> : string[];
  body: T;
}>;

function createApiConf<T, Q extends string[], K extends Q[number]>(
  obj: Partial<TypeApiConf<T, Array<K>>>
): Required<TypeApiConf<T, Array<K>>> {
  return {
    path: "",
    params: [],
    query: [],
    bodyKeys: [],
    body: {} as T,
    ...obj
  };
}

const apiConfig = {
  // 交换前后端路径配置信息
  SWOP_PATH_CONFIG: createApiConf({
    path: "/path/config/swop",
    bodyKeys: Object.keys(new ElectronPathCollection().create()) as [
      ...Array<keyof TypePathCollection>
    ],
    body: {} as TypePathCollection
  }),

  /**
   * @deprecated
   * 获取 resourceConfig 路径
   */
  GET_PATH_CONFIG: createApiConf({
    path: "/path/config"
  }),
  // 图片服务
  IMAGE: createApiConf({
    path: "/image",
    query: ["filepath"]
    // body: Buffer.from("")
  }),
  // 获取图片数据
  IMAGE_DATA: createApiConf({
    path: "/image/data"
  }),

  /**
   * 获取资源配置数据
   */
  // 获取场景配置列表
  GET_SCENARIO_OPTION_LIST: createApiConf({
    path: "/scenario/option/list"
  }),
  // 获取场景配置
  GET_SCENARIO_CONFIG: createApiConf({
    path: "/scenario/config",
    query: ["config"]
  }),
  // 获取配置信息列表
  GET_RESOURCE_OPTION_LIST: createApiConf({
    path: "/resource/config/preview/list",
    query: ["src"]
  }),
  // 获取模板配置数据
  GET_RESOURCE_CONFIG: createApiConf({
    path: "/resource/config",
    query: ["config"]
  }),
  // 获取配置模块列表
  GET_RESOURCE_CONFIG_MODULE_LIST: createApiConf({
    path: "/resource/config/module/list",
    query: ["config"]
  }),
  // 获取配置页面数据
  GET_RESOURCE_CONFIG_PAGE_CONFIG: createApiConf({
    path: "/resource/config/page",
    query: ["namespace", "config"]
  }),

  // 创建工程
  CREATE_PROJECT: createApiConf({
    path: "/project/create",
    body: {} as TypeCreateProjectPayload
  }),
  // 更新工程
  UPDATE_PROJECT: createApiConf({
    path: "/project/update",
    params: ["uuid"],
    body: {} as Partial<TypeProjectData>
  }),
  // 更新描述信息
  UPDATE_PROJECT_INFO: createApiConf({
    path: "/project/update/info",
    query: ["uuid"],
    body: {} as TypeProjectInfo
  }),
  // 更新UI版本信息
  UPDATE_UI_VERSION: createApiConf({
    path: "/project/update/ui-version",
    params: ["uuid"],
    body: {} as TypeUiVersion
  }),
  // 获取工程列表
  GET_PROJECT_LIST: createApiConf({
    path: "/project/list",
    params: ["scenarioMd5"]
  }),
  // 通过 id 获取工程信息
  GET_PROJECT_DATA: createApiConf({
    path: "/project",
    params: [] as Array<keyof TypeProjectDataDoc>
  }),
  /**
   * @deprecated
   * 取页面配置的素材文件数据
   */
  GET_PAGE_RESOURCE: createApiConf({
    path: "/project/resource",
    params: ["uuid"],
    query: ["config"]
  }),

  // 按行写入 xml
  XML_TEMPLATE_WRITE: createApiConf({
    path: "/project/xml/template/write",
    bodyKeys: ["tag", "attributes", "value", "src"],
    body: {} as TypeWriteXmlTempPayload
  }),
  // 通过 name 查找工程的 value
  GET_XML_TEMP_VALUE: createApiConf({
    path: "/project/xml/value",
    query: ["uuid", "name", "src"]
  }),

  // 获取一个文件的数据
  GET_PROJECT_FILE_DATA: createApiConf({
    path: "/project/file/data",
    query: ["filepath"]
  }),
  // 复制文件
  COPY_FILE: createApiConf({
    path: "/file/copy",
    bodyKeys: ["from", "to"]
  }),
  // 写入本地文件
  WRITE_FILE: createApiConf({
    path: "/file/write",
    bodyKeys: []
  }),
  // 删除本地文件
  DELETE_FILE: createApiConf({
    path: "/file/delete",
    bodyKeys: ["file"]
  }),

  // 工程打包
  PACK_PROJECT: createApiConf({
    path: "/project/pack",
    query: ["scenarioMd5", "packDir", "outputFile"]
  }),
  // 工程解包
  UNPACK_PROJECT: createApiConf({
    path: "/project/unpack",
    query: ["scenarioMd5", "unpackFile", "outputDir"]
  }),
  // 应用到手机
  APPLY_PROJECT: createApiConf({
    path: "/project/apply"
  })
} as const;

export default apiConfig;
