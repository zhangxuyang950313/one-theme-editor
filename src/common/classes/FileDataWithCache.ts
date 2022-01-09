import fse from "fs-extra";
import { FileData } from "src/data/ResourceConfig";

import LogUtil from "../utils/LogUtil";

import type { TypeFileData } from "src/types/file-data";

type TypeGetFileMethod = (file: string) => TypeFileData;

/**
 * 文件数据缓存
 * 传入获取文件数据方法，第一个参数应为 file，返回标准 fileData @TypeGetFileMethod
 * 传入方法是为了渲染进程去调用主进程方法，而不要在渲染进程再缓存一份缓存数据
 */
export default class FileDataWithCache {
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
