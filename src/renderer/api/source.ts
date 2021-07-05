import API from "common/api";
import { TypeBrandConf } from "types/project";
import {
  TypeSourceConfig,
  TypeSourceConfigBrief,
  TypeSourcePageConf,
  TypeSourcePageData
} from "types/source-config";
import { TypeResponseFrame } from "types/request";
import { createHttp } from "./utils";

// 获取厂商列表
export async function apiGetBrandConfList(): Promise<TypeBrandConf[]> {
  return createHttp()
    .get<TypeResponseFrame<TypeBrandConf[]>>(API.GET_BRAND_LIST)
    .then(data => data.data.data);
}

// 获取厂商配置描述列表
export async function apiGetSourceDescriptionList(
  brandType: TypeBrandConf["type"]
): Promise<TypeSourceConfigBrief[]> {
  return createHttp()
    .get<TypeResponseFrame<TypeSourceConfigBrief[]>>(
      `${API.GET_SOURCE_DESC_LIST}/${brandType}`
    )
    .then(data => data.data.data);
}

// 获取配置数据
export async function apiGetSourceConfig(
  descriptionFile: string
): Promise<TypeSourceConfig> {
  return createHttp()
    .get<TypeResponseFrame<TypeSourceConfig>>(API.GET_SOURCE_CONF_DATA, {
      params: { descriptionFile }
    })
    .then(data => data.data.data);
}

// 获取页面配置数据
export async function apiGetSourcePageData(
  pageFile: string
): Promise<TypeSourcePageData> {
  return createHttp()
    .get<TypeResponseFrame<TypeSourcePageData>>(API.GET_SOURCE_PAGE_CONFIG, {
      params: { pageFile }
    })
    .then(data => data.data.data);
}
