import API from "common/api";
import {
  TypeBrandConf,
  TypeCreateProjectPayload,
  TypeProjectData,
  TypeProjectDataDoc
} from "types/project";
import { TypeResponseFrame, TypeGetCanceler } from "types/request";
import { createHttp } from "./utils";

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
