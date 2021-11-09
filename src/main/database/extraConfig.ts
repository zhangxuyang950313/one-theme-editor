import logSymbols from "log-symbols";
import PathUtil from "src/common/utils/PathUtil";
import PathCollection from "src/data/PathCollection";
import {
  TypePathCollection,
  TypePathConfigInDoc,
  TypeServerConfig
} from "src/types/config.extra";
import { EXTRA_DATA_TYPE } from "src/common/enums";
import { createNedb } from "src/common/utils/databaseUtil";
import ServerConfig from "src/data/ServerConfig";

// 频繁修改工程数据，常驻内存
console.debug(logSymbols.info, "扩展数据库文件：", PathUtil.EXTRA_DB);
const extraData = createNedb(PathUtil.EXTRA_DB, { timestampData: false });

// 获取路径配置数据
export async function getPathConfig(): Promise<TypePathCollection> {
  const pathConfig = await extraData.findOne<TypePathConfigInDoc>({
    type: EXTRA_DATA_TYPE.PATH_CONFIG
  });
  return new PathCollection().setBatch(pathConfig).create();
}

// 添加路径配置
export async function updatePathConfig(
  data: Partial<TypePathCollection>
): Promise<TypePathCollection> {
  await extraData.update<TypePathCollection>(
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
  await extraData.update<TypePathCollection>(
    { type: EXTRA_DATA_TYPE.SERVER_CONFIG },
    { type: EXTRA_DATA_TYPE.SERVER_CONFIG, ...data },
    { multi: true, upsert: true /*更新所有匹配项目，不存在则创建*/ }
  );
  return getServerConfig();
}
