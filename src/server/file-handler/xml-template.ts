import path from "path";
import fse from "fs-extra";
import PATHS from "server/utils/pathUtils";
import XmlTemplate from "server/compiler/XmlTemplate";
import {
  TypeReleaseXmlTempPayload,
  UnionTupleToObjectKey
} from "types/request";
import API from "src/common/api";

/**
 * 输出被 key value 处理过模板字符串的 xml 模板
 * @param data
 */
export function releaseXmlTemplate(data: TypeReleaseXmlTempPayload): void {
  const absPath = path.join(PATHS.SOURCE_CONFIG_DIR, data.template);
  const xmlStr = new XmlTemplate(absPath).generateXml([
    { key: data.key, value: data.value }
  ]);
  fse.ensureDirSync(path.dirname(data.releaseXml));
  fse.writeFileSync(data.releaseXml, xmlStr);
}

/**
 * 获取 xml 模板 name 属性值对应的 text value
 * @param data
 * @returns
 */
export function getXmlTempValueByNameAttrVal(
  data: UnionTupleToObjectKey<typeof API.GET_XML_TEMP_VALUE.query>
): string {
  return new XmlTemplate(data.releaseXml).getValueByName(data.name);
}
