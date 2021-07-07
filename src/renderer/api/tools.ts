import API from "common/api";
import { TypePathConfig } from "server/utils/pathUtils";
import { TypeResponseFrame } from "types/request";
import { createHttp } from "./utils";

// 获取路径信息
export async function apiGetPathConfig(): Promise<TypePathConfig> {
  return createHttp()
    .get<TypeResponseFrame<TypePathConfig>>(API.GET_PATH_CONFIG)
    .then(data => data.data.data);
}

// // 写入文件
// export async function apiWriteFile(
//   fileData: TypeFileData,
//   to: string
// ): Promise<TypeResponseFrame> {
//   return createHttp()
//     .post<TypeResponseFrame>(API.WRITE_FILE, { fileData, to })
//     .then(data => data.data);
// }

// 复制文件
export async function apiCopyFile(
  from: string,
  to: string
): Promise<TypeResponseFrame> {
  return createHttp()
    .post<TypeResponseFrame>(API.COPY_FILE, { from, to })
    .then(data => data.data);
}

// 删除文件
export async function apiDeleteFile(file: string): Promise<TypeResponseFrame> {
  return createHttp()
    .post<TypeResponseFrame>(API.DELETE_FILE, { file })
    .then(data => data.data);
}
