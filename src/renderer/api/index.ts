import axios from "axios";
import {
  TypeBrandConf,
  TypeDatabase,
  TypeProjectData,
  TypeTemplateConf,
  TypeUiVersionConf
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
  // 获取工程列表
  GET_PROJECT_LIST: "/project/list",
  // 创建工程
  CREATE_PROJECT: "/project/create"
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

// 获取模板信息
export async function getTemplateInfo(
  brandConf: TypeBrandConf,
  uiVersionConf: TypeUiVersionConf
) {
  // todo
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

// 创建工程
export async function createProject(
  data: TypeProjectData
): Promise<TypeProjectData> {
  return http
    .post<TypeResponseFrame<TypeProjectData>>(API.CREATE_PROJECT, data)
    .then(data => data.data.data);
}
