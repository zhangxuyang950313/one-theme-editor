import FileType, { FileTypeResult } from "file-type";
import { MimeTypedBuffer } from "electron";
import fse from "fs-extra";

import LogUtil from "../utils/LogUtil";

/**
 * 文件数据缓存
 * 传入获取文件数据方法，第一个参数应为 file，返回 buffer @TypeGetFileMethod
 */
export default class FileBufferCache {
  private fileMap = new Map<string, { mtime: Date; buffer: Buffer }>();
  private mimeTypeMap = new Map<
    string,
    { mtime: Date; mimeType: FileTypeResult | "" }
  >();

  get(file: string): Buffer {
    // 不存在返回默认数据对象
    if (!fse.existsSync(file)) {
      this.fileMap.delete(file);
      return Buffer.from("");
    }

    // 根据最后修改时间进行协商缓存
    const { mtime } = fse.statSync(file);
    const cache = this.fileMap.get(file);
    if (cache && cache.mtime >= mtime) {
      LogUtil.cache("fileBuffer", file);
      return cache.buffer;
    }

    // 获取数据
    const buff = fse.readFileSync(file);
    this.fileMap.set(file, { mtime: new Date(), buffer: buff });

    return buff;
  }

  async getMimeType(file: string): Promise<FileTypeResult | ""> {
    // 不存在返回默认数据对象
    if (!fse.existsSync(file)) {
      this.fileMap.delete(file);
      return "";
    }
    // 根据最后修改时间进行协商缓存
    const { mtime } = fse.statSync(file);
    const cache = this.mimeTypeMap.get(file);
    if (cache && cache.mtime >= mtime) {
      LogUtil.cache("mimeType", file);
      return cache.mimeType;
    }

    const buffer = this.get(file);
    const mimeType = (await FileType.fromBuffer(buffer)) || "";

    this.fileMap.set(file, { mtime: new Date(), buffer });
    this.mimeTypeMap.set(file, { mtime: new Date(), mimeType });

    return mimeType;
  }

  async getMimeTypedBuffer(file: string): Promise<MimeTypedBuffer> {
    // 获取数据
    const buffer = this.get(file);
    const mimeType = await this.getMimeType(file);
    return {
      mimeType: (mimeType || "") as string,
      data: buffer
    };
  }
}
