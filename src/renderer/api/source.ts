import API from "common/api";
import { TypeBrandConf } from "types/project";
import {
  TypeSourceConfig,
  TypeSourceConfigBrief,
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
      `${API.GET_SOURCE_CONF_LIST}/${brandType}`
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
export async function apiGetSourcePageConfData(
  pageFile: string
): Promise<TypeSourcePageData> {
  return createHttp()
    .get<TypeResponseFrame<TypeSourcePageData>>(API.GET_SOURCE_CONF_PAGE_DATA, {
      params: { pageFile }
    })
    .then(data => data.data.data);
}

export async function apiGetTempValueByName() {
  return createHttp().get(API.GET_PROJECT_XML_TEMP_VALUE, {});
}
