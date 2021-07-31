import path from "path";
import fse from "fs-extra";
import API from "src/common/apiConf";
import PATHS from "server/utils/pathUtils";
import XmlTemplate from "server/compiler/XmlTemplate";
import {
  TypeReleaseXmlTempPayload,
  UnionTupleToObjectKey
} from "types/request";
import { findProjectByUUID } from "server/db-handler/project";

/**
 * 输出被 key value 处理过模板字符串的 xml 模板
 * @param data
 */
export async function releaseXmlTemplate(
  uuid: string,
  data: TypeReleaseXmlTempPayload
): Promise<Record<string, string>> {
  const project = await findProjectByUUID(uuid);
  const { name, value, src } = data;
  const sourceRoot = path.join(
    PATHS.SOURCE_CONFIG_DIR,
    path.dirname(project.sourceConfigPath)
  );
  const templateXml = path.join(sourceRoot, src);
  const releaseXml = path.join(project.projectPathname, src);
  // 节点操作
  const templateNode = new XmlTemplate(templateXml);
  const releaseNode = new XmlTemplate(releaseXml);
  const templateRoot = templateNode.getRootNode();
  const releaseRoot = releaseNode.getRootNode();
  const fromNode = templateRoot.getFirstChildNodeByAttrValue("name", name);
  const targetNode = releaseRoot.getFirstChildNodeByAttrValue("name", name);
  // 空文件用模板替换
  if (releaseNode.isEmpty()) {
    templateRoot.clearChildren();
    releaseNode.setNode(templateNode);
  }
  // 创建 text value 并替换子节点
  if (fromNode.isEmpty()) {
    throw new Error(`模板中不存在 name="${name}"`);
  }
  fromNode.getFirstChildNode().replaceNode(XmlTemplate.createTextNode(value));
  // 插入工程文件
  if (targetNode.isEmpty()) {
    releaseRoot.appendChild(fromNode);
  } else {
    targetNode.replaceNode(fromNode);
  }
  const xmlStr = releaseNode.buildXml();
  fse.ensureDirSync(path.dirname(releaseXml));
  fse.writeFileSync(releaseXml, xmlStr);
  return { uuid, name: data.name, value: data.value, release: releaseXml };
}

/**
 * 获取 xml 模板 name 属性值对应的 text value
 * @param data
 * @returns
 */
export function getXmlTempValueByNameAttrVal(
  data: UnionTupleToObjectKey<typeof API.GET_XML_TEMP_VALUE.query>
): string {
  return new XmlTemplate(data.src).getValueByName(data.name);
}
