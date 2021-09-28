import { TypeProjectFileData } from "./project";

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

// 同步文件内容参数
export type TypeSyncFileContentPayload = {
  projectRoot: string;
  srcList: string[];
};

// 同步文件内容结果
export type TypeSyncFileContent = {
  file: string;
  data: TypeProjectFileData;
};
