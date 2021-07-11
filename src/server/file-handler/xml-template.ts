import path from "path";
import fse from "fs-extra";
import PATHS from "server/utils/pathUtils";
import XmlTemplate from "server/compiler/XmlTemplate";
import {
  TypeReleaseXmlTempPayload,
  TypeGetValueByNamePayload
} from "types/request";

/**
 * 输出被 key value 处理过模板字符串的 xml 模板
 * @param data
 */
export function releaseXmlTemplate(data: TypeReleaseXmlTempPayload): void {
  const absPath = path.join(PATHS.SOURCE_CONFIG_DIR, data.template);
  const xmlStr = new XmlTemplate(absPath).generateXml([
    { key: data.key, value: data.value }
  ]);
  fse.ensureDirSync(path.dirname(data.release));
  fse.writeFileSync(data.release, xmlStr);
}

/**
 * 获取 xml 模板 name 属性值对应的 text value
 * @param data
 * @returns
 */
export function getXmlTempValueByNameAttrVal(
  data: TypeGetValueByNamePayload
): string {
  return new XmlTemplate(data.template).getValueByName(data.name);
}
