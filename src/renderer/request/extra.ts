import apiConfig from "src/common/apiConf";
import { TypeElectronPath, TypePathConfig } from "src/types/extraConfig";
import { TypeRequestResult } from "src/types/request";
import { createHttp } from "./axios";

/**
 * @deprecated
 * 获取后端路径信息
 * @returns
 */
export async function apiGetPathConfig(): Promise<TypePathConfig> {
  return createHttp()
    .get<TypeRequestResult<TypePathConfig>>(apiConfig.GET_PATH_CONFIG.path)
    .then(data => data.data.data);
}

// 给后端设置路径配置
export async function apiSwopPathConfig(
  config: TypeElectronPath
): Promise<TypePathConfig> {
  return createHttp()
    .post<TypeRequestResult<TypePathConfig>>(
      apiConfig.SWOP_PATH_CONFIG.path,
      config
    )
    .then(data => data.data.data);
}
