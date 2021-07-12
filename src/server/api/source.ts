import API from "common/api";
import { TypeBrandConf } from "types/project";
import {
  TypeSourceConfigData,
  TypeSourceConfigInfo,
  TypeSourcePageData
} from "types/source-config";
import { TypeRequestResult } from "types/request";
import { createHttp } from "./axios";

// 获取厂商列表
export async function apiGetBrandConfList(): Promise<TypeBrandConf[]> {
  return createHttp()
    .get<TypeRequestResult<TypeBrandConf[]>>(API.GET_BRAND_LIST)
    .then(data => data.data.data);
}

// 获取厂商配置描述列表
export async function apiGetSourceDescriptionList(
  brandType: TypeBrandConf["type"]
): Promise<TypeSourceConfigInfo[]> {
  return createHttp()
    .get<TypeRequestResult<TypeSourceConfigInfo[]>>(
      `${API.GET_SOURCE_CONF_LIST}/${brandType}`
    )
    .then(data => data.data.data);
}

// 获取配置数据
export async function apiGetSourceConfig(
  descriptionFile: string
): Promise<TypeSourceConfigData> {
  return createHttp()
    .get<TypeRequestResult<TypeSourceConfigData>>(API.GET_SOURCE_CONF_DATA, {
      params: { descriptionFile }
    })
    .then(data => data.data.data);
}

// 获取页面配置数据
export async function apiGetSourcePageConfData(
  pageFile: string
): Promise<TypeSourcePageData> {
  return createHttp()
    .get<TypeRequestResult<TypeSourcePageData>>(API.GET_SOURCE_CONF_PAGE_DATA, {
      params: { pageFile }
    })
    .then(data => data.data.data);
}
