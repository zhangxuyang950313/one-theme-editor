import FileBufferCache from "src/common/classes/FileBufferCache";
import FileDataCache from "src/common/classes/FileDataCache";
import { getFileData } from "src/common/utils";

// 文件信息缓存
export const fileDataCache = new FileDataCache(getFileData);

export const fileBufferCache = new FileBufferCache();
