import axios from "axios";
import {
  TypeBrandConf,
  TypeCreateProjectData,
  TypeDatabase,
  TypeProjectData,
  TypeTemplateConf
  // TypeUiVersionConf
} from "types/project";
import { HOST, PORT } from "common/config";

const http = axios.create({
  baseURL: `http://${HOST}:${PORT}`
});

const API = {
  // 获取厂商信息列表
  GET_BRAND_LIST: "/brand/list",
  // 获取模板列表
  GET_TEMPLATE_LIST: "/template/list",
  // 获取模板配置
  GET_TEMPLATE_CONF: "/template/conf",
  // 创建工程
  CREATE_PROJECT: "/project/create",
  // 更新工程
  UPDATE_PROJECT: "/project/update",
  // 获取工程列表
  GET_PROJECT_LIST: "/project/list",
  // 通过 id 获取工程信息
  GET_PROJECT_BY_ID: "/project/find"
};

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
    .get<TypeResponseFrame<TypeTemplateConf[]>>(API.GET_TEMPLATE_LIST, {
      params: { brandType: brandConf.type }
    })
    .then(data => data.data.data);
}

// // 获取模板信息
// export async function getTemplateInfo(
//   brandConf: TypeBrandConf,
//   uiVersionConf: TypeUiVersionConf
// ) {
//   // todo
// }

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
      API.GET_PROJECT_LIST,
      { params: { brandType: brandInfo.type } }
    )
    .then(data => data.data.data);
}

// 通过 _id 查询工程
export async function getProjectById(
  id: string
): Promise<TypeDatabase<TypeProjectData>> {
  return http
    .get<TypeResponseFrame<TypeDatabase<TypeProjectData>>>(
      API.GET_PROJECT_BY_ID,
      { params: { id } }
    )
    .then(data => data.data.data);
}

// 通过 _id 更新工程
export async function updateProjectById(
  id: string,
  data: TypeProjectData
): Promise<TypeDatabase<TypeProjectData>> {
  return http
    .post<TypeResponseFrame<TypeDatabase<TypeProjectData>>>(
      `${API.UPDATE_PROJECT}/${id}`,
      data
    )
    .then(data => data.data.data);
}
