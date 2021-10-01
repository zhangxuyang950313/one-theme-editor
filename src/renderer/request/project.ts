import apiConfig from "src/common/apiConf";
import {
  TypeCreateProjectPayload,
  TypeProjectData,
  TypeProjectDataDoc,
  TypeProjectFileData
} from "src/types/project";
import {
  TypeRequestResult,
  TypeGetCanceler,
  UnionTupleToObjectKey,
  TypeReleaseXmlTempPayload
} from "src/types/request";
import { TypeScenarioOption } from "src/types/resource";
import { createHttp } from "./axios";

// 创建工程
export async function apiCreateProject(
  data: TypeCreateProjectPayload
): Promise<TypeProjectData> {
  return createHttp()
    .post<TypeRequestResult<TypeProjectData>>(
      apiConfig.CREATE_PROJECT.path,
      data
    )
    .then(data => data.data.data);
}

// 获取工程列表
export async function apiGetProjectList(
  scenarioOption: TypeScenarioOption,
  canceler?: TypeGetCanceler
): Promise<TypeProjectDataDoc[]> {
  return createHttp(canceler)
    .get<TypeRequestResult<TypeProjectDataDoc[]>>(
      `${apiConfig.GET_PROJECT_LIST.path}/${scenarioOption.md5}`
    )
    .then(data => data.data.data);
}

// 查询工程
export async function apiGetProjectByUUID(
  uuid: string,
  canceler?: TypeGetCanceler
): Promise<TypeProjectDataDoc> {
  return createHttp(canceler)
    .get<TypeRequestResult<TypeProjectDataDoc>>(
      apiConfig.GET_PROJECT_DATA.path,
      { params: { uuid } }
    )
    .then(data => data.data.data);
}

// 更新工程
export async function apiUpdateProject(
  data: Partial<TypeProjectData>
): Promise<TypeProjectDataDoc> {
  return createHttp()
    .post<TypeRequestResult<TypeProjectDataDoc>>(
      apiConfig.UPDATE_PROJECT.path,
      { params: data.uuid, data }
    )
    .then(data => data.data.data);
}

/**
 * 获取 xml 模板值
 * @param data
 * @returns
 */
export async function apiGetTempValueByName(
  data: UnionTupleToObjectKey<typeof apiConfig.GET_XML_TEMP_VALUE.query>
): Promise<string> {
  return createHttp()
    .get<TypeRequestResult<{ value: string }>>(
      apiConfig.GET_XML_TEMP_VALUE.path,
      { params: data }
    )
    .then(data => data.data.data.value);
}

/**
 * 输出 xml 模板
 * @param data
 * @returns
 */
export async function apiWriteXmlTemplate(
  uuid: string,
  data: TypeReleaseXmlTempPayload
): Promise<void | null> {
  return createHttp()
    .post<TypeRequestResult<null>>(apiConfig.XML_TEMPLATE_WRITE.path, data, {
      params: { uuid }
    })
    .then(data => data.data.data);
}

/**
 * 获取工程中资源文件数据
 * @param uuid
 * @param filepath
 * @returns
 */
export async function apiGetProjectFileData(
  uuid: string,
  filepath: string
): Promise<TypeProjectFileData> {
  return createHttp()
    .get<TypeRequestResult<TypeProjectFileData>>(
      apiConfig.GET_RESOURCE_FILE.path,
      { params: { filepath, uuid } }
    )
    .then(data => data.data.data);
}
