import apiConfig from "src/common/apiConf";
import {
  TypeResourceConfig,
  TypeResourceOption,
  TypeResourcePageConf,
  TypeScenarioOption
} from "src/types/resource";
import { TypeRequestResult, UnionTupleToObjectKey } from "src/types/request";
import { createHttp } from "./axios";

// 获取场景列表
export async function apiGetScenarioOptionList(): Promise<
  TypeScenarioOption[]
> {
  return createHttp()
    .get<TypeRequestResult<TypeScenarioOption[]>>(
      apiConfig.GET_SCENARIO_OPTION_LIST.path
    )
    .then(data => data.data.data);
}

// 获取资源配置列表
export async function apiGetSourceOptionList(
  src: string
): Promise<TypeResourceOption[]> {
  return createHttp()
    .get<TypeRequestResult<TypeResourceOption[]>>(
      `${apiConfig.GET_SOURCE_CONF_PREVIEW_LIST.path}`,
      { params: { src } }
    )
    .then(data => data.data.data);
}

// 获取配置数据
export async function apiGetSourceConfig(
  config: string
): Promise<TypeResourceConfig> {
  return createHttp()
    .get<TypeRequestResult<TypeResourceConfig>>(
      apiConfig.GET_SOURCE_CONF_DATA.path,
      {
        params: { config }
      }
    )
    .then(data => data.data.data);
}

// 获取页面配置数据
export async function apiGetSourcePageConfData(
  params: UnionTupleToObjectKey<
    typeof apiConfig.GET_SOURCE_CONF_PAGE_DATA.query
  >
): Promise<TypeResourcePageConf> {
  return createHttp()
    .get<TypeRequestResult<TypeResourcePageConf>>(
      apiConfig.GET_SOURCE_CONF_PAGE_DATA.path,
      { params }
    )
    .then(data => data.data.data);
}