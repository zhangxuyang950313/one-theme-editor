import path from "path";
import fse from "fs-extra";
import PATHS from "server/utils/pathUtils";
import XmlTemplate from "server/compiler/XmlTemplate";
import { TypeReleaseXmlTempPayload } from "types/request";

/**
 * 输出被 key value 处理过模板字符串的 xml 模板
 * @param data
 */
export function releaseXmlTemplate(data: TypeReleaseXmlTempPayload): void {
  const absPath = path.join(PATHS.SOURCE_CONFIG_DIR, data.template);
  const xmlTemp = new XmlTemplate(absPath);
  const xmlStr = xmlTemp.generateXml(data.key, data.value);
  fse.ensureDirSync(path.dirname(data.release));
  fse.writeFileSync(data.release, xmlStr);
}
