import apiConfig from "src/constant/apiConf";
import {
  TypeCreateProjectPayload,
  TypeProjectData,
  TypeProjectDataDoc
} from "src/types/project";
import { TypeFileData } from "src/types/resource.page";
import {
  TypeGetCanceler,
  UnionTupleToObjectKey,
  TypeWriteXmlTempPayload
} from "src/types/request";
import { TypeScenarioOption } from "src/types/scenario.config";
import { createHttp } from "./axios";

// 创建工程
export async function apiCreateProject<T = TypeProjectData>(
  data: TypeCreateProjectPayload
): Promise<T> {
  return createHttp()
    .post<TypeCreateProjectPayload, T>(apiConfig.CREATE_PROJECT.path, data)
    .then(data => data);
}

// 获取工程列表
export async function apiGetProjectList<T = TypeProjectDataDoc[]>(
  scenarioOption: TypeScenarioOption,
  canceler?: TypeGetCanceler
): Promise<T> {
  return createHttp(canceler)
    .get<T>(`${apiConfig.GET_PROJECT_LIST.path}/${scenarioOption.md5}`)
    .then(data => data.data);
}

// 查询工程
export async function apiGetProjectByUUID<T = TypeProjectDataDoc>(
  uuid: string,
  canceler?: TypeGetCanceler
): Promise<T> {
  return createHttp(canceler)
    .get<T>(apiConfig.GET_PROJECT_DATA.path, {
      params: { uuid }
    })
    .then(data => data.data);
}

// 更新工程
export async function apiUpdateProject<T = TypeProjectDataDoc>(
  uuid: string,
  data: Partial<TypeProjectData>
): Promise<T> {
  return createHttp()
    .post<{ params: string; data: typeof data }, T>(
      apiConfig.UPDATE_PROJECT.path,
      { params: uuid, data }
    )
    .then(data => data);
}

/**
 * 获取 xml 模板值
 * @param data
 * @returns
 */
export async function apiGetTempValueByName<T = { value: string }>(
  data: UnionTupleToObjectKey<typeof apiConfig.GET_XML_TEMP_VALUE.query>
): Promise<T> {
  return createHttp()
    .get<T>(apiConfig.GET_XML_TEMP_VALUE.path, { params: data })
    .then(data => data.data);
}

/**
 * 输出 xml 模板
 * @param data
 * @returns
 */
export async function apiWriteXmlTemplate(
  data: TypeWriteXmlTempPayload
): Promise<null> {
  return createHttp()
    .post<typeof data, null>(apiConfig.XML_TEMPLATE_WRITE.path, data)
    .then(data => data);
}

/**
 * 获取工程中文件数据
 * @param uuid
 * @param filepath
 * @returns
 */
export async function apiGetProjectFileData<T = TypeFileData>(
  filepath: string
): Promise<T> {
  return createHttp()
    .get<T>(apiConfig.GET_PROJECT_FILE_DATA.path, {
      params: { filepath }
    })
    .then(data => data.data);
}
