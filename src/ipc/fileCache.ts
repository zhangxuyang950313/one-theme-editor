import FileCache from "src/common/FileCache";
import { getFileDataSync } from "src/common/utils";

// 文件缓存
export default new FileCache(getFileDataSync);
