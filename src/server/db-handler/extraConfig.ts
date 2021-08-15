import logSymbols from "log-symbols";
import pathUtil from "server/utils/pathUtil";
import AppPath from "data/AppPath";
import { TypePathConfig, TypePathConfigInDoc } from "types/extraConfig";
import { EXTRA_DATA_TYPE } from "src/enum";
import { createNedb } from "server/utils/databaseUtil";

// 频繁修改工程数据，常驻内存
console.debug(logSymbols.info, "扩展数据库文件：", pathUtil.EXTRA_DATA_DB);
const extraData = createNedb(pathUtil.EXTRA_DATA_DB, { timestampData: false });

// 获取配置数据
export async function getPathConfig(): Promise<TypePathConfig> {
  const pathConfig = await extraData.findOne<TypePathConfigInDoc>({
    type: EXTRA_DATA_TYPE.PATH_CONFIG
  });
  return new AppPath()
    .set("AAPT_TOOL", pathConfig.AAPT_TOOL)
    .set("ADB_TOOL", pathConfig.ADB_TOOL)
    .set("ASSETS_DIR", pathConfig.ASSETS_DIR)
    .set("BINARY_DIR", pathConfig.BINARY_DIR)
    .set("CLIENT_CACHE", pathConfig.CLIENT_CACHE)
    .set("CLIENT_DATA", pathConfig.CLIENT_DATA)
    .set("CLIENT_STATIC", pathConfig.CLIENT_STATIC)
    .set("EXTRA_DATA_DB", pathConfig.EXTRA_DATA_DB)
    .set("PROJECTS_DB", pathConfig.PROJECTS_DB)
    .set("RESOURCE_DIR", pathConfig.RESOURCE_DIR)
    .set("SOURCE_CONFIG_DIR", pathConfig.SOURCE_CONFIG_DIR)
    .set("SOURCE_CONFIG_FILE", pathConfig.SOURCE_CONFIG_FILE)
    .set("ELECTRON_APP_DATA", pathConfig.ELECTRON_APP_DATA)
    .set("ELECTRON_APP_PATH", pathConfig.ELECTRON_APP_PATH)
    .set("ELECTRON_CACHE", pathConfig.ELECTRON_CACHE)
    .set("ELECTRON_DESKTOP", pathConfig.ELECTRON_DESKTOP)
    .set("ELECTRON_DOCUMENTS", pathConfig.ELECTRON_DOCUMENTS)
    .set("ELECTRON_DOWNLOADS", pathConfig.ELECTRON_DOWNLOADS)
    .set("ELECTRON_EXE", pathConfig.ELECTRON_EXE)
    .set("ELECTRON_HOME", pathConfig.ELECTRON_HOME)
    .set("ELECTRON_LOCAL", pathConfig.ELECTRON_LOCAL)
    .set("ELECTRON_LOGS", pathConfig.ELECTRON_LOGS)
    .create();
}

// 添加路径配置
export async function updatePathConfig(
  data: TypePathConfig
): Promise<TypePathConfig> {
  await extraData.update<TypePathConfig>(
    { type: EXTRA_DATA_TYPE.PATH_CONFIG },
    { type: EXTRA_DATA_TYPE.PATH_CONFIG, ...data },
    { multi: true, upsert: true } // 更新所有匹配项目，不存在则创建
  );
  return getPathConfig();
}
