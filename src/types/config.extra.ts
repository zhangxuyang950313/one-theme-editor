import PathUtil from "src/common/utils/PathUtil";

import { EXTRA_DATA_TYPE } from "../common/enums/index";

import type { TypeDatabase } from "../types/utils";

export type TypePathCollection = typeof PathUtil;

export type TypePathConfigInDoc = {
  readonly type: EXTRA_DATA_TYPE.PATH_CONFIG;
} & TypeDatabase<TypePathCollection>;

export type TypeServerConfig = {
  host: string;
  port: number;
};

export type TypeServerConfigInDoc = {
  readonly type: EXTRA_DATA_TYPE.SERVER_CONFIG;
} & TypeDatabase<TypeServerConfig>;
