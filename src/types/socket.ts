// 打包参数
export type TypePackSendPayload = {
  scenarioMd5: string;
  packDir: string;
  outputFile: string;
};

// 解包参数
export type TypeUnpackSendPayload = {
  scenarioMd5: string;
  outputDir: string;
  unpackFile: string;
};

// 打包流程
export type TypePackProcess = {
  msg: string;
  data: any;
};
