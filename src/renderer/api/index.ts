import axios, { Canceler } from "axios";
import { HOST, PORT } from "common/config";
import API from "common/api";
import {
  TypeBrandConf,
  TypeCreateProjectData,
  TypeImageMapper,
  TypeProjectData,
  TypeProjectDataDoc
} from "types/project";
import { TypeSourceConfig } from "types/sourceConfig";
import { TypeFileData, TypeResponseFrame } from "types/request";

type TypeGetCanceler = (c: Canceler) => void;

const createHttp = (getCanceler?: TypeGetCanceler) => {
  return axios.create({
    baseURL: `http://${HOST}:${PORT}`,
    cancelToken: getCanceler && new axios.CancelToken(getCanceler)
  });
};

// 获取厂商列表
export async function apiGetBrandConfList(): Promise<TypeBrandConf[]> {
  return createHttp()
    .get<TypeResponseFrame<TypeBrandConf[]>>(API.GET_BRAND_LIST)
    .then(data => data.data.data);
}

// 获取厂商配置
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
  data: TypeCreateProjectData
): Promise<TypeProjectData> {
  return createHttp()
    .post<TypeResponseFrame<TypeProjectData>>(API.CREATE_PROJECT, data)
    .then(data => data.data.data);
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

// 增加图片映射
export async function apiAddImageMapper(
  uuid: string,
  data: TypeImageMapper
): Promise<TypeProjectDataDoc> {
  return createHttp()
    .post<TypeResponseFrame<TypeProjectDataDoc>>(
      `${API.ADD_IMAGE_MAPPER}/${uuid}`,
      data
    )
    .then(data => data.data.data);
}

// 删除图片映射
export async function apiDelImageMapper(
  uuid: string,
  target: string
): Promise<TypeProjectDataDoc> {
  return createHttp()
    .post<TypeResponseFrame<TypeProjectDataDoc>>(
      `${API.DEL_IMAGE_MAPPER}/${uuid}`,
      { target }
    )
    .then(data => data.data.data);
}

// 写入文件
export async function apiWriteFile(
  fileData: TypeFileData,
  to: string
): Promise<TypeResponseFrame> {
  return createHttp()
    .post<TypeResponseFrame>(API.WRITE_FILE, { fileData, to })
    .then(data => data.data);
}

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
