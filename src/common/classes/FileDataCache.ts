import fse from "fs-extra";
import { FileData } from "src/data/ResourceConfig";
import { TypeFileData } from "src/types/file-data";
import LogUtil from "../utils/LogUtil";

type TypeGetFileMethod = (file: string) => TypeFileData;

// 文件数据缓存
export default class FileDataCache {
  private fileDataMap = new Map<string, { mtime: Date; data: TypeFileData }>();
  private getFileMethod: TypeGetFileMethod;
  constructor(getFileMethod: TypeGetFileMethod) {
    this.getFileMethod = getFileMethod;
  }

  get(file: string): TypeFileData {
    // 不存在返回默认数据对象
    if (!fse.existsSync(file)) {
      this.fileDataMap.delete(file);
      return FileData.default;
    }

    // 根据最后修改时间进行协商缓存
    const { mtime } = fse.statSync(file);
    const cache = this.fileDataMap.get(file);
    if (cache && cache.mtime >= mtime) {
      LogUtil.cache("fileData", file);
      return cache.data;
    }

    // 获取 fileData
    const fileData = this.getFileMethod(file);
    switch (fileData.filetype) {
      case "image/webp":
      case "image/apng":
      case "image/png":
      case "image/jpeg":
      case "application/xml": {
        this.fileDataMap.set(file, { mtime, data: fileData });
        break;
      }
    }

    return fileData;
  }
}
