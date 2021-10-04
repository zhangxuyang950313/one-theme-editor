import apiConfig from "src/constant/apiConf";
import {
  TypeResourceConfig,
  TypeResourceOption,
  TypeResPageConfig,
  TypeScenarioConfig,
  TypeScenarioOption
} from "src/types/resource";
import { UnionTupleToObjectKey } from "src/types/request";
import { createHttp } from "./axios";

// 获取场景列表
export async function apiGetScenarioOptionList<
  T = TypeScenarioOption[]
>(): Promise<T> {
  return createHttp()
    .get<T>(apiConfig.GET_SCENARIO_OPTION_LIST.path)
    .then(data => data.data);
}

// 获取资源配置列表
export async function apiGetResOptionList<T = TypeResourceOption[]>(
  src: string
): Promise<T> {
  return createHttp()
    .get<T>(`${apiConfig.GET_RESOURCE_CONFIG_PREVIEW_LIST.path}`, {
      params: { src }
    })
    .then(data => data.data);
}

// 获取配置数据
export async function apiGetResourceConfig<T = TypeResourceConfig>(
  config: string
): Promise<T> {
  return createHttp()
    .get<T>(apiConfig.GET_RESOURCE_CONFIG.path, {
      params: { config }
    })
    .then(data => data.data);
}

// 获取场景配置
export async function apiGetScenarioConfig<T = TypeScenarioConfig>(
  config: string
): Promise<T> {
  return createHttp()
    .get<T>(apiConfig.GET_SCENARIO_CONFIG.path, { params: { config } })
    .then(data => data.data);
}

// 获取页面配置数据
export async function apiGetResPageConfData<T = TypeResPageConfig>(
  params: UnionTupleToObjectKey<
    typeof apiConfig.GET_RESOURCE_CONFIG_PAGE_CONFIG.query
  >
): Promise<T> {
  return createHttp()
    .get<T>(apiConfig.GET_RESOURCE_CONFIG_PAGE_CONFIG.path, { params })
    .then(data => data.data);
}
