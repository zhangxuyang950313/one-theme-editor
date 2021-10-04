import apiConfig from "src/constant/apiConf";
import { TypeElectronPath, TypePathConfig } from "src/types/extraConfig";
import { createHttp } from "./axios";

/**
 * @deprecated
 * 获取后端路径信息
 * @returns
 */
export async function apiGetPathConfig<T = TypePathConfig>(): Promise<T> {
  return createHttp()
    .get<T>(apiConfig.GET_PATH_CONFIG.path)
    .then(data => data.data);
}

// 给后端设置路径配置
export async function apiSwopPathConfig<T = TypePathConfig>(
  config: TypeElectronPath
): Promise<T> {
  return createHttp()
    .post<typeof config, T>(apiConfig.SWOP_PATH_CONFIG.path, config)
    .then(data => data);
}
