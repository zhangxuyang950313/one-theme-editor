import archiver from "archiver";
import { FILE_TEMPLATE_TYPE, PACK_TYPE } from "../enum";

/*************************** scenarioConfig **************************/
// 工程文件模板配置
export type TypeFileTempConfig = {
  output: string;
  type: FILE_TEMPLATE_TYPE;
  items: Array<{
    name: string;
    description: string;
    disabled: boolean;
    visible: boolean;
  }>;
  template: string;
};
// 打包配置
export type TypePackConfig = {
  extname: string;
  format: archiver.Format;
  execute9patch: boolean;
  items: Array<{ type: PACK_TYPE; pattern: string }>;
  excludes: Array<{ regex: string; pattern: string }>;
};
// 应用配置
export type TypeApplyConfig = {
  steps: Array<{ description: string; command: string }>;
};
// 场景配置选项
export type TypeScenarioOption = {
  name: string;
  md5: string;
  src: string;
} & TypeScenarioConfig;
// 场景配置数据
export type TypeScenarioConfig = {
  fileTempList: TypeFileTempConfig[];
  packageConfig: TypePackConfig;
  applyConfig: TypeApplyConfig;
};
/*****************************************************/