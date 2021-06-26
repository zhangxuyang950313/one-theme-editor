import path from "path";
import fse from "fs-extra";
import SourceDescription from "@/data/SourceDescription";
import { SOURCE_CONFIG_DIR, SOuRCE_CONFIG_FILE } from "common/paths";
import { TypeBrandConf } from "types/project";
import { TypeSourceDescription } from "types/source-config";

import ERR_CODE from "renderer/core/error-code";

// 读取厂商配置
export async function readBrandConf(): Promise<TypeBrandConf[]> {
  if (!fse.existsSync(SOuRCE_CONFIG_FILE)) {
    throw new Error(ERR_CODE[4003]);
  }
  return JSON.parse(fse.readFileSync(SOuRCE_CONFIG_FILE, "utf-8"));
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
  if (!brandConf) return [];
  const queue = brandConf.sourceConfigs
    .map(item => path.join(SOURCE_CONFIG_DIR, item, "description.xml"))
    .filter(item => fse.existsSync(item))
    .map(item => new SourceDescription(item).getData());
  return await Promise.all(queue);
}
