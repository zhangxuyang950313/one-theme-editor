import path from "path";
import { asyncMap } from "common/utils";
import fse from "fs-extra";
import SourceConfig from "@/data/SourceConfig";
import { SOURCE_CONFIG_DIR, SOuRCE_CONFIG_FILE } from "server/core/path-config";
import { TypeBrandConf } from "types/project";
import { TypeSourceDescription } from "types/source-config";

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
  const ensureConfigs = brandConf.sourceConfigs.filter(namespace =>
    fse.existsSync(
      path.join(SOURCE_CONFIG_DIR, namespace, SourceConfig.filename)
    )
  );
  return asyncMap(ensureConfigs, namespace =>
    new SourceConfig(namespace).getDescription()
  );
}
