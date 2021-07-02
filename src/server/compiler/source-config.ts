import fse from "fs-extra";
import {
  getSCDescriptionByNamespace,
  SOuRCE_CONFIG_FILE
} from "server/core/pathUtils";
import { asyncMap } from "common/utils";
import { TypeBrandConf } from "types/project";
import { TypeSourceDescription } from "types/source-config";
import SourceConfig from "@/data/SourceConfig";

import ERR_CODE from "renderer/core/error-code";

// 读取厂商配置
export async function readBrandConf(): Promise<TypeBrandConf[]> {
  if (!fse.existsSync(SOuRCE_CONFIG_FILE)) {
    throw new Error(ERR_CODE[4003]);
  }
  return fse.readJsonSync(SOuRCE_CONFIG_FILE);
}

/**
 * 解析当前厂商下所有预览配置
 * @param brandType 厂商 type
 * @returns
 */
export async function compileSourceDescriptionList(
  brandType: string
): Promise<TypeSourceDescription[]> {
  const brandConfList = await readBrandConf();
  const brandConf = brandConfList.find(item => item.type === brandType);
  if (!brandConf?.sourceConfigs) return [];
  const ensureConfigs = brandConf.sourceConfigs.flatMap(namespace => {
    const absPath = getSCDescriptionByNamespace(namespace);
    return fse.existsSync(absPath) ? [absPath] : [];
  });
  return asyncMap(ensureConfigs, configFile =>
    new SourceConfig(configFile).getDescription()
  );
}
