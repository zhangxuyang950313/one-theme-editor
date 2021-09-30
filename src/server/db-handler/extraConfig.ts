import logSymbols from "log-symbols";
import pathUtil from "server/utils/pathUtil";
import PathCollection from "src/data/PathCollection";
import {
  TypePathConfig,
  TypePathConfigInDoc,
  TypeServerConfig
} from "src/types/extraConfig";
import { EXTRA_DATA_TYPE } from "src/enum";
import { createNedb } from "server/utils/databaseUtil";
import ServerConfig from "src/data/ServerConfig";

// 频繁修改工程数据，常驻内存
console.debug(logSymbols.info, "扩展数据库文件：", pathUtil.EXTRA_DATA_DB);
const extraData = createNedb(pathUtil.EXTRA_DATA_DB, { timestampData: false });

// 获取路径配置数据
export async function getPathConfig(): Promise<TypePathConfig> {
  const pathConfig = await extraData.findOne<TypePathConfigInDoc>({
    type: EXTRA_DATA_TYPE.PATH_CONFIG
  });
  return new PathCollection().setBatch(pathConfig).create();
}

// 添加路径配置
export async function updatePathConfig(
  data: Partial<TypePathConfig>
): Promise<TypePathConfig> {
  await extraData.update<TypePathConfig>(
    { type: EXTRA_DATA_TYPE.PATH_CONFIG },
    { type: EXTRA_DATA_TYPE.PATH_CONFIG, ...data },
    { multi: true, upsert: true /*更新所有匹配项目，不存在则创建*/ }
  );
  return getPathConfig();
}

// 获取服务配置数据
export async function getServerConfig(): Promise<TypeServerConfig> {
  const serverConfig = await extraData.findOne<TypeServerConfig>({
    type: EXTRA_DATA_TYPE.PATH_CONFIG
  });
  return new ServerConfig().setBatch(serverConfig).create();
}

// 添加服务配置
export async function updateServerConfig(
  data: Partial<TypeServerConfig>
): Promise<TypeServerConfig> {
  await extraData.update<TypePathConfig>(
    { type: EXTRA_DATA_TYPE.SERVER_CONFIG },
    { type: EXTRA_DATA_TYPE.SERVER_CONFIG, ...data },
    { multi: true, upsert: true /*更新所有匹配项目，不存在则创建*/ }
  );
  return getServerConfig();
}
