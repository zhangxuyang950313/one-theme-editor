import logSymbols from "log-symbols";
import pathUtil from "server/utils/pathUtil";
import AppPathCollection from "src/data/AppPath";
import { TypePathConfig, TypePathConfigInDoc } from "src/types/extraConfig";
import { EXTRA_DATA_PROP } from "src/enum";
import { createNedb } from "server/utils/databaseUtil";
import { KeysEnum } from "src/types";

// 频繁修改工程数据，常驻内存
console.debug(logSymbols.info, "扩展数据库文件：", pathUtil.EXTRA_DATA_DB);
const extraData = createNedb(pathUtil.EXTRA_DATA_DB, { timestampData: false });

// 获取配置数据
export async function getPathConfig(): Promise<TypePathConfig> {
  const pathConfig = await extraData.findOne<TypePathConfigInDoc>({
    type: EXTRA_DATA_PROP.PATH_CONFIG
  });
  const appPath = new AppPathCollection();
  (Object.keys(pathConfig) as KeysEnum<TypePathConfig>).forEach(key => {
    appPath.set(key, pathConfig[key]);
  });
  return appPath.create();
}

// 添加路径配置
export async function updatePathConfig(
  data: TypePathConfig
): Promise<TypePathConfig> {
  await extraData.update<TypePathConfig>(
    { type: EXTRA_DATA_PROP.PATH_CONFIG },
    { type: EXTRA_DATA_PROP.PATH_CONFIG, ...data },
    { multi: true, upsert: true } // 更新所有匹配项目，不存在则创建
  );
  return getPathConfig();
}
