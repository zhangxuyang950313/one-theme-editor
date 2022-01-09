import { FILE_TEMPLATE_TYPE, PACK_TYPE } from "../common/enums";

import type { TypeResourceConfig } from "./config.resource";

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
  execute9patch: boolean;
  steps: Array<{
    type: PACK_TYPE;
    dir: string;
    pattern?: string;
    cache?: boolean;
  }>;
  excludes: Array<{ regex: string; pattern: string }>;
};
// 应用配置
export type TypeApplyConfig = {
  steps: Array<{ description: string; command: string }>;
};
// 场景配置数据
export type TypeScenarioConfig = {
  name: string;
  fileTempList: TypeFileTempConfig[];
  packageConfig: TypePackConfig;
  applyConfig: TypeApplyConfig;
  resourceConfigList: TypeResourceConfig[];
};

export type TypeScenarioOption = {
  src: string;
} & TypeScenarioConfig;
