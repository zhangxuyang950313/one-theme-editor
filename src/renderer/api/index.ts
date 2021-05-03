import axios from "axios";
import {
  TypeBrandInfo,
  TypeProjectData,
  TypeProjectThm,
  TypeTemplateConf
} from "types/project";
import { HOST, PORT } from "common/config";

const http = axios.create({
  baseURL: `http://${HOST}:${PORT}`
});

const API = {
  // 厂商列表
  GET_BRAND_INFO_LIST: "/brand/list",
  GET_TEMPLATE_LIST: "/template/list",
  GET_PROJECT_LIST: "/project/list",
  CREATE_PROJECT: "/project/create"
};

type TypeResponseFrame<T> = {
  msg: "success" | "fail";
  data: T;
};

// 获取厂商列表
export async function getBrandList(): Promise<TypeBrandInfo[]> {
  return http
    .get<TypeResponseFrame<TypeBrandInfo[]>>(API.GET_BRAND_INFO_LIST)
    .then(data => data.data.data);
}

// 获取模板列表
export async function getTemplateList(
  brandInfo: TypeBrandInfo
): Promise<TypeTemplateConf[]> {
  return http
    .get<TypeResponseFrame<TypeTemplateConf[]>>(API.GET_TEMPLATE_LIST, {
      params: { brandType: brandInfo.type }
    })
    .then(data => data.data.data);
}

// 获取工程列表
export async function getProjectList(
  brandInfo: TypeBrandInfo
): Promise<TypeProjectThm[]> {
  return http
    .get<TypeResponseFrame<TypeProjectThm[]>>(API.GET_PROJECT_LIST, {
      params: { brandType: brandInfo.type }
    })
    .then(data => data.data.data);
}

// 创建工程
export async function createProject(
  data: TypeProjectThm
): Promise<TypeProjectThm> {
  return http
    .post<TypeResponseFrame<TypeProjectThm>>(API.CREATE_PROJECT, {
      data
    })
    .then(data => data.data.data);
}
