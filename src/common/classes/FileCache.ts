import md5 from "md5";
import fse from "fs-extra";
import FileType, { FileTypeResult } from "file-type";
import { MimeTypedBuffer } from "electron";

import { FileData } from "src/data/ResourceConfig";

import LogUtil from "../utils/LogUtil";
import { getFileData } from "../utils";

import type { TypeFileData } from "src/types/file-data";

type TypeFileTypeResult = FileTypeResult | { ext: ""; mime: "" };

/**
 * 文件数据缓存
 * 支持缓存的数据：buffer/md5/mimeType/electronMimeTypedBuffer
 */
export default class FileCache {
  private mtimeMap = new Map<string, Date>();
  private bufferMap = new Map<string, Buffer>();
  private md5Map = new Map<string, string>();
  private mimeTypeMap = new Map<string, TypeFileTypeResult>();
  private fileDataMap = new Map<string, TypeFileData>();

  constructor() {
    setInterval(() => {
      this.gc();
      this.update();
    }, 10000);
  }

  // 根据最后修改时间进行协商缓存
  private checkExpired(file: string) {
    if (!fse.existsSync(file)) return true;
    const { mtime } = fse.statSync(file);
    const mtimeCache = this.mtimeMap.get(file);
    return !mtimeCache || mtimeCache < mtime;
  }

  private updateMtime(file: string) {
    this.mtimeMap.set(file, new Date());
  }

  private getFiles() {
    return Array.from(this.bufferMap.keys());
  }

  // 删除缓存
  private deleteCache(file: string) {
    this.bufferMap.delete(file);
    this.mtimeMap.delete(file);
    this.md5Map.delete(file);
    this.mimeTypeMap.delete(file);
    this.fileDataMap.delete(file);
  }

  // 垃圾回收，回收不存在的文件
  private gc() {
    this.getFiles().forEach(file => {
      if (fse.existsSync(file)) return;
      console.log("垃圾回收", file);
      this.deleteCache(file);
    });
  }

  // 重新加载缓存
  private reload(file: string) {
    this.getBuffer(file);
    this.getMd5(file);
    this.getMimeType(file);
    this.getFileData(file);
  }

  // 自动加载，重新加载过期的数据
  private update() {
    this.getFiles().forEach(file => {
      if (this.checkExpired(file)) {
        console.log("重新加载", file);
        this.reload(file);
      }
    });
  }

  getBuffer(file: string, showLog = true): Buffer {
    // 不存在返回默认数据对象
    if (!fse.existsSync(file)) {
      this.deleteCache(file);
      return Buffer.from("");
    }

    const bufferCache = this.bufferMap.get(file);
    if (bufferCache && !this.checkExpired(file)) {
      showLog && LogUtil.cache("fileBuffer", file);
      return bufferCache;
    }

    // 获取数据
    const buffer = fse.readFileSync(file);
    this.bufferMap.set(file, buffer);
    this.updateMtime(file);

    return buffer;
  }

  getMd5(file: string, showLog = true): string {
    const md5Cache = this.md5Map.get(file);
    if (md5Cache && !this.checkExpired(file)) {
      showLog && LogUtil.cache("fileMd5", file);
      return md5Cache;
    }

    const buffer = this.getBuffer(file);
    const md5Val = md5(buffer);
    this.md5Map.set(file, md5Val);
    this.updateMtime(file);

    return md5Val;
  }

  getFileData(file: string): TypeFileData {
    // 不存在返回默认数据对象
    if (!fse.existsSync(file)) {
      this.deleteCache(file);
      return FileData.default;
    }

    const fileDataCache = this.fileDataMap.get(file);
    if (fileDataCache && !this.checkExpired(file)) {
      LogUtil.cache("fileData", file);
      return fileDataCache;
    }

    // 获取 fileData
    const fileData = getFileData(file);
    switch (fileData.filetype) {
      case "image/webp":
      case "image/apng":
      case "image/png":
      case "image/jpeg":
      case "application/xml": {
        this.fileDataMap.set(file, fileData);
        this.updateMtime(file);
        break;
      }
    }

    return fileData;
  }

  async getMimeType(file: string): Promise<TypeFileTypeResult> {
    const defaultFileType: TypeFileTypeResult = { ext: "", mime: "" };

    const mimeTypeCache = this.mimeTypeMap.get(file);
    if (mimeTypeCache && !this.checkExpired(file)) {
      LogUtil.cache("mimeType", file);
      return mimeTypeCache;
    }

    const buffer = this.getBuffer(file);
    const mimeType = (await FileType.fromBuffer(buffer)) || defaultFileType;
    this.mimeTypeMap.set(file, mimeType);
    this.updateMtime(file);

    return mimeType;
  }

  // 返回 electron 专用 MimeTypedBuffer 类型
  async getElectronMimeTypedBuffer(file: string): Promise<MimeTypedBuffer> {
    // 获取数据
    const buffer = this.getBuffer(file);
    const mimeType = await this.getMimeType(file);
    return {
      mimeType: mimeType.mime,
      data: buffer
    };
  }
}
