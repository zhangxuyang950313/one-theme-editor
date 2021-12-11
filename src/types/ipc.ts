import { CopyOptions } from "fs-extra";
import { TypePackConfig } from "src/types/config.scenario";

export type TypeCopyPayload = {
  from: string;
  to: string;
  options?: CopyOptions;
};

// 写入 xml 模板参数
export type TypeWriteXmlTempPayload = {
  src: string;
  tag: string;
  attributes: [string, string][];
  value: string;
};

export type TypeCompact9patchPayload = {
  from: string;
  to?: string;
};

export type TypeExportPayload = {
  packConfig: TypePackConfig;
  packDir: string;
  outputFile: string;
};

export type TypePackPayload = {
  packConfig: TypePackConfig;
  packDir: string;
};

export type TypeUnpackPayload = {
  packConfig: TypePackConfig;
  unpackFile: string;
  outputDir: string;
};
