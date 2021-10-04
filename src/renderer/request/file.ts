import apiConfig from "src/constant/apiConf";
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
export async function apiCopyFile(data: {
  from: string;
  to: string;
}): Promise<null> {
  return createHttp()
    .post<typeof data, null>(apiConfig.COPY_FILE.path, data)
    .then(data => data);
}

// 删除文件
export async function apiDeleteFile(file: string): Promise<null> {
  return createHttp()
    .post<{ file: string }, null>(apiConfig.DELETE_FILE.path, { file })
    .then(data => data);
}
