import axios from "axios";
import {
  TypeBrandConf,
  TypeCreateProjectData,
  TypeDatabase,
  TypeProjectData
} from "types/project";
import { TypeTemplateConf } from "types/template";
import { HOST, PORT } from "common/config";
import API from "common/api";

const http = axios.create({
  baseURL: `http://${HOST}:${PORT}`
});

type TypeResponseFrame<T> = {
  msg: "success" | "fail";
  data: T;
};

// 获取厂商列表
export async function getBrandConfList(): Promise<TypeBrandConf[]> {
  return http
    .get<TypeResponseFrame<TypeBrandConf[]>>(API.GET_BRAND_LIST)
    .then(data => data.data.data);
}

// 获取模板列表
export async function getTempConfList(
  brandConf: TypeBrandConf
): Promise<TypeTemplateConf[]> {
  return http
    .get<TypeResponseFrame<TypeTemplateConf[]>>(
      `${API.GET_TEMPLATE_LIST}/${brandConf.type}`
    )
    .then(data => data.data.data);
}

// 创建工程
export async function createProject(
  data: TypeCreateProjectData
): Promise<TypeProjectData> {
  return http
    .post<TypeResponseFrame<TypeProjectData>>(API.CREATE_PROJECT, data)
    .then(data => data.data.data);
}
// 获取工程列表
export async function getProjectList(
  brandInfo: TypeBrandConf
): Promise<TypeDatabase<TypeProjectData>[]> {
  return http
    .get<TypeResponseFrame<TypeDatabase<TypeProjectData>[]>>(
      `${API.GET_PROJECT_LIST}/${brandInfo.type}`
    )
    .then(data => data.data.data);
}

// 查询工程
export async function getProjectByUUID(
  uuid: string
): Promise<TypeDatabase<TypeProjectData>> {
  return http
    .get<TypeResponseFrame<TypeDatabase<TypeProjectData>>>(
      `${API.GET_PROJECT}/${uuid}`
    )
    .then(data => data.data.data);
}

// 更新工程
export async function updateProject(
  data: TypeProjectData
): Promise<TypeDatabase<TypeProjectData>> {
  return http
    .post<TypeResponseFrame<TypeDatabase<TypeProjectData>>>(
      `${API.UPDATE_PROJECT}/${data.uuid}`,
      data
    )
    .then(data => data.data.data);
}
