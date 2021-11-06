import apiConfig from "src/constant/apiConf";
import { TypePathCollection } from "src/types/config.extra";
import { createHttp } from "./axios";

/**
 * @deprecated
 * 获取后端路径信息
 * @returns
 */
export async function apiGetPathConfig<T = TypePathCollection>(): Promise<T> {
  return createHttp()
    .get<T>(apiConfig.GET_PATH_CONFIG.path)
    .then(data => data.data);
}
