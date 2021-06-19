import axios, { Canceler } from "axios";
import {
  TypeBrandConf,
  TypeCreateProjectData,
  TypeImageMapper,
  TypeProjectData,
  TypeProjectDataDoc
} from "types/project";
import { TypeTemplateConf } from "types/template";
import { HOST, PORT } from "common/config";
import API from "common/api";

type TypeGetCanceler = (c: Canceler) => void;

type TypeResponseFrame<T> = {
  msg: "success" | "fail";
  data: T;
};

const createHttp = (getCanceler?: TypeGetCanceler) => {
  return axios.create({
    baseURL: `http://${HOST}:${PORT}`,
    cancelToken: getCanceler && new axios.CancelToken(getCanceler)
  });
};

// 获取厂商列表
export async function getBrandConfList(): Promise<TypeBrandConf[]> {
  return createHttp()
    .get<TypeResponseFrame<TypeBrandConf[]>>(API.GET_BRAND_LIST)
    .then(data => data.data.data);
}

// 获取模板列表
export async function getTempConfList(
  brandConf: TypeBrandConf
): Promise<TypeTemplateConf[]> {
  return createHttp()
    .get<TypeResponseFrame<TypeTemplateConf[]>>(
      `${API.GET_TEMPLATE_LIST}/${brandConf.type}`
    )
    .then(data => data.data.data);
}

// 创建工程
export async function createProject(
  data: TypeCreateProjectData
): Promise<TypeProjectData> {
  return createHttp()
    .post<TypeResponseFrame<TypeProjectData>>(API.CREATE_PROJECT, data)
    .then(data => data.data.data);
}
// 获取工程列表
export async function getProjectList(
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
export async function getProjectByUUID(
  uuid: string,
  canceler?: TypeGetCanceler
): Promise<TypeProjectDataDoc> {
  return createHttp(canceler)
    .get<TypeResponseFrame<TypeProjectDataDoc>>(`${API.GET_PROJECT}/${uuid}`)
    .then(data => data.data.data);
}

// 更新工程
export async function updateProject(
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
export async function addImageMapper(
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
export async function delImageMapper(
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
