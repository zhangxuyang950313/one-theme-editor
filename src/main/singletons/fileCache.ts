import FileCache from "src/common/classes/FileCache";
import FileDataWithCache from "src/common/classes/FileDataWithCache";
import { getFileData } from "src/common/utils";

// 文件信息缓存
export const fileDataWithCache = new FileDataWithCache(getFileData);

export const fileCache = new FileCache();
