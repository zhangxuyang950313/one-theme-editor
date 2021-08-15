import API from "src/common/apiConf";
import { TypeElectronPath, TypePathConfig } from "types/extraConfig";
import { TypeRequestResult } from "types/request";
import { createHttp } from "./axios";

// 获取后端路径信息
export async function apiGetPathConfig(): Promise<TypePathConfig> {
  return createHttp()
    .get<TypeRequestResult<TypePathConfig>>(API.GET_PATH_CONFIG.url)
    .then(data => data.data.data);
}

// 给后端设置路径配置
export async function apiSwopPathConfig(
  config: TypeElectronPath
): Promise<TypePathConfig> {
  return createHttp()
    .post<TypeRequestResult<TypePathConfig>>(API.SWOP_PATH_CONFIG.url, config)
    .then(data => data.data.data);
}
