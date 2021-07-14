import API from "common/apiConf";
import { TypePathConfig } from "server/utils/pathUtils";
import { TypeRequestResult } from "types/request";
import { createHttp } from "./axios";

/**
 * 初始化接口，用于给后端传前端数据放入 cookies，避免每次都要传参
 * @param data
 * @returns
 */
export async function apiInitCookies(
  data: Record<string, string>
): Promise<null> {
  return createHttp()
    .post<TypeRequestResult<null>>(API.INIT.url, data)
    .then(data => data.data.data);
}

// 获取路径信息
export async function apiGetPathConfig(): Promise<TypePathConfig> {
  return createHttp()
    .get<TypeRequestResult<TypePathConfig>>(API.GET_PATH_CONFIG.url)
    .then(data => data.data.data);
}

// // 写入文件
// export async function apiWriteFile(
//   fileData: TypeFileData,
//   to: string
// ): Promise<TypeRequestResult> {
//   return createHttp()
//     .post<TypeRequestResult>(API.WRITE_FILE, { fileData, to })
//     .then(data => data.data);
// }

// 复制文件
export async function apiCopyFile(from: string, to: string): Promise<null> {
  return createHttp()
    .post<TypeRequestResult<null>>(API.COPY_FILE.url, { from, to })
    .then(data => data.data.data);
}

// 删除文件
export async function apiDeleteFile(file: string): Promise<null> {
  return createHttp()
    .post<TypeRequestResult<null>>(API.DELETE_FILE.url, { file })
    .then(data => data.data.data);
}
