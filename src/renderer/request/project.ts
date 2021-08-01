import API from "common/apiConf";
import {
  TypeBrandConf,
  TypeCreateProjectPayload,
  TypeProjectData,
  TypeProjectDataDoc,
  TypeProjectFileData
} from "types/project";
import {
  TypeRequestResult,
  TypeGetCanceler,
  UnionTupleToObjectKey,
  TypeReleaseXmlTempPayload
} from "types/request";
import { createHttp } from "./axios";

// 创建工程
export async function apiCreateProject(
  data: TypeCreateProjectPayload
): Promise<TypeProjectData> {
  return createHttp()
    .post<TypeRequestResult<TypeProjectData>>(API.CREATE_PROJECT.url, data)
    .then(data => data.data.data);
}

// 获取工程列表
export async function apiGetProjectList(
  brandInfo: TypeBrandConf,
  canceler?: TypeGetCanceler
): Promise<TypeProjectDataDoc[]> {
  return createHttp(canceler)
    .get<TypeRequestResult<TypeProjectDataDoc[]>>(
      `${API.GET_PROJECT_LIST.url}/${brandInfo.type}`
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
      `${API.GET_PROJECT.url}/${uuid}`
    )
    .then(data => data.data.data);
}

// 更新工程
export async function apiUpdateProject(
  data: TypeProjectData
): Promise<TypeProjectDataDoc> {
  return createHttp()
    .post<TypeRequestResult<TypeProjectDataDoc>>(
      `${API.UPDATE_PROJECT.url}/${data.uuid}`,
      data
    )
    .then(data => data.data.data);
}

/**
 * 获取 xml 模板值
 * @param data
 * @returns
 */
export async function apiGetTempValueByName(
  data: UnionTupleToObjectKey<typeof API.GET_XML_TEMP_VALUE.query>
): Promise<string> {
  return createHttp()
    .get<TypeRequestResult<{ value: string }>>(API.GET_XML_TEMP_VALUE.url, {
      params: data
    })
    .then(data => data.data.data.value);
}

/**
 * 输出 xml 模板
 * @param data
 * @returns
 */
export async function apiOutputXmlTemplate(
  uuid: string,
  data: TypeReleaseXmlTempPayload
): Promise<void | null> {
  return createHttp()
    .post<TypeRequestResult<null>>(API.XML_TEMPLATE_WRITE.url, data, {
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
      `${API.GET_SOURCE_FILE_DATA.url}/${uuid}`,
      { params: { filepath } }
    )
    .then(data => data.data.data);
}
