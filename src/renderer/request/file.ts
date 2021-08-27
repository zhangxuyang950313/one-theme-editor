import API from "src/common/apiConf";
import { TypeRequestResult } from "src/types/request";
import { createHttp } from "./axios";

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
