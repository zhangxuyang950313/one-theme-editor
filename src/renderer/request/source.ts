import API from "src/common/apiConf";
import {
  TypeSourceConfigData,
  TypeSourceConfigInfo,
  TypeSourcePageData,
  TypeBrandOption
} from "src/types/source";
import { TypeRequestResult, UnionTupleToObjectKey } from "src/types/request";
import { createHttp } from "./axios";

// 获取厂商列表
export async function apiGetBrandOptionList(): Promise<TypeBrandOption[]> {
  return createHttp()
    .get<TypeRequestResult<TypeBrandOption[]>>(API.GET_BRAND_OPTION_LIST.url)
    .then(data => data.data.data);
}

// 获取厂商配置描述列表
export async function apiGetSourceInfoList(
  src: string
): Promise<TypeSourceConfigInfo[]> {
  return createHttp()
    .get<TypeRequestResult<TypeSourceConfigInfo[]>>(
      `${API.GET_SOURCE_CONF_LIST.url}`,
      { params: { src } }
    )
    .then(data => data.data.data);
}

// 获取配置数据
export async function apiGetSourceConfig(
  config: string
): Promise<TypeSourceConfigData> {
  return createHttp()
    .get<TypeRequestResult<TypeSourceConfigData>>(
      API.GET_SOURCE_CONF_DATA.url,
      { params: { config } }
    )
    .then(data => data.data.data);
}

// 获取页面配置数据
export async function apiGetSourcePageConfData(
  params: UnionTupleToObjectKey<typeof API.GET_SOURCE_CONF_PAGE_DATA.query>
): Promise<TypeSourcePageData> {
  return createHttp()
    .get<TypeRequestResult<TypeSourcePageData>>(
      API.GET_SOURCE_CONF_PAGE_DATA.url,
      { params }
    )
    .then(data => data.data.data);
}
