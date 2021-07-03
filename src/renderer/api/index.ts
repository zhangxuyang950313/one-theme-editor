import axios, { Canceler } from "axios";
import {
  TypeBrandConf,
  TypeCreateProjectPayload,
  TypeProjectData,
  TypeProjectDataDoc
} from "types/project";
import { TypeSourceConfig, TypeSourceDescription } from "types/source-config";
import { TypeResponseFrame } from "types/request";
import { HOST, PORT } from "common/config";
import API from "common/api";
import * as paths from "server/core/pathUtils";

type TypeGetCanceler = (c: Canceler) => void;

const createHttp = (getCanceler?: TypeGetCanceler) => {
  const http = axios.create({
    baseURL: `http://${HOST}:${PORT}`,
    cancelToken: getCanceler && new axios.CancelToken(getCanceler),
    validateStatus: status => [200, 400].includes(status)
  });
  http.interceptors.response.use(data => {
    if (data.status === 200) return data;
    throw new Error(data.data.data);
  });
  return http;
};

// 获取路径信息
export async function apiGetPathConfig(): Promise<typeof paths> {
  return createHttp()
    .get<TypeResponseFrame<typeof paths>>(API.GET_PATH_CONFIG)
    .then(data => data.data.data);
}

// 获取厂商列表
export async function apiGetBrandConfList(): Promise<TypeBrandConf[]> {
  return createHttp()
    .get<TypeResponseFrame<TypeBrandConf[]>>(API.GET_BRAND_LIST)
    .then(data => data.data.data);
}

// 获取厂商配置描述列表
export async function apiGetSourceDescriptionList(
  brandType: TypeBrandConf["type"]
): Promise<TypeSourceDescription[]> {
  return createHttp()
    .get<TypeResponseFrame<TypeSourceDescription[]>>(
      `${API.GET_SOURCE_DESCRIPTION_LIST}/${brandType}`
    )
    .then(data => data.data.data);
}

// 获取厂商配置列表
export async function apiGetSourceConfigList(
  brandType: TypeBrandConf["type"]
): Promise<TypeSourceConfig[]> {
  return createHttp()
    .get<TypeResponseFrame<TypeSourceConfig[]>>(
      `${API.GET_SOURCE_CONFIG_LIST}/${brandType}`
    )
    .then(data => data.data.data);
}

// 创建工程
export async function apiCreateProject(
  data: TypeCreateProjectPayload
): Promise<TypeProjectData> {
  return createHttp()
    .post<TypeResponseFrame<TypeProjectData>>(API.CREATE_PROJECT, data)
    .then(data => data.data.data);
  // .catch(err => {
  //   throw new Error(err.message);
  // });
}
// 获取工程列表
export async function apiGetProjectList(
  brandInfo: TypeBrandConf,
  canceler?: TypeGetCanceler
): Promise<TypeProjectDataDoc[]> {
  return createHttp(canceler)
    .get<TypeResponseFrame<TypeProjectDataDoc[]>>(
      `${API.GET_PROJECT_LIST}/${brandInfo.type}`
    )
    .then(data => data.data.data);
}

// 查询工程
export async function apiGetProjectByUUID(
  uuid: string,
  canceler?: TypeGetCanceler
): Promise<TypeProjectDataDoc> {
  return createHttp(canceler)
    .get<TypeResponseFrame<TypeProjectDataDoc>>(`${API.GET_PROJECT}/${uuid}`)
    .then(data => data.data.data);
}

// 更新工程
export async function apiUpdateProject(
  data: TypeProjectData
): Promise<TypeProjectDataDoc> {
  return createHttp()
    .post<TypeResponseFrame<TypeProjectDataDoc>>(
      `${API.UPDATE_PROJECT}/${data.uuid}`,
      data
    )
    .then(data => data.data.data);
}

// // 写入文件
// export async function apiWriteFile(
//   fileData: TypeFileData,
//   to: string
// ): Promise<TypeResponseFrame> {
//   return createHttp()
//     .post<TypeResponseFrame>(API.WRITE_FILE, { fileData, to })
//     .then(data => data.data);
// }

// 复制文件
export async function apiCopyFile(
  from: string,
  to: string
): Promise<TypeResponseFrame> {
  return createHttp()
    .post<TypeResponseFrame>(API.COPY_FILE, { from, to })
    .then(data => data.data);
}

// 删除文件
export async function apiDeleteFile(file: string): Promise<TypeResponseFrame> {
  return createHttp()
    .post<TypeResponseFrame>(API.DELETE_FILE, { file })
    .then(data => data.data);
}
