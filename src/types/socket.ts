import { WatchOptions } from "chokidar";
import { SOCKET_EVENT } from "src/common/socketConf";
import { FILE_EVENT } from "src/enum";
import { TypeFileData } from "./project";

export type TypeErrorData = {
  event: SOCKET_EVENT;
  message: string;
};

// 打包参数
export type TypePackPayload = {
  scenarioSrc: string;
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

// 添加监听文件参数
export type TypeWatchFilesPayload = {
  options: WatchOptions;
  files: ReadonlyArray<string>;
};

// 取消监听文件参数
export type TypeUnWatchFilesPayload = TypeWatchFilesPayload["files"];

// 同步文件内容
export type TypeSyncFileContent = {
  file: string;
  event: FILE_EVENT;
  data: TypeFileData;
};
