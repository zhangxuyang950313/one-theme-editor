import { WatchOptions } from "chokidar";
import { SOCKET_EVENT } from "src/common/socketConf";
import { FILE_EVENT } from "src/enum";
import { TypeProjectFileData } from "./project";

export type TypeErrorData = {
  event: SOCKET_EVENT;
  message: string;
};

// 打包参数
export type TypePackPayload = {
  scenarioMd5: string;
  packDir: string;
  outputFile: string;
};

// 解包参数
export type TypeUnpackPayload = {
  scenarioMd5: string;
  outputDir: string;
  unpackFile: string;
};

// 打包流程
export type TypePackProcess = {
  msg: string;
  data: any;
};

// 创建文件监视器
export type TypeCreateFileWatcherPayload = WatchOptions;

// 添加监听文件参数，同 watcher.add(x: string | ReadonlyArray<string>)
export type TypeWatchFilePayload = string | ReadonlyArray<string>;

// 同步文件内容
export type TypeSyncFileContent = {
  file: string;
  event: FILE_EVENT;
  data: TypeProjectFileData;
};
