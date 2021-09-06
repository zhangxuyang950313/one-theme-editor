import path from "path";
import fse from "fs-extra";
import API from "src/common/apiConf";
import pathUtil from "server/utils/pathUtil";
import XmlTemplate from "server/compiler/XmlTemplate";
import {
  TypeReleaseXmlTempPayload,
  UnionTupleToObjectKey
} from "src/types/request";
import { findProjectByQuery } from "server/db-handler/project";
import XmlFileCompiler from "server/compiler/XmlFileCompiler";

/**
 * 输出被 key value 处理过模板字符串的 xml 模板
 * @param data
 */
export async function releaseXmlTemplate(
  uuid: string,
  data: TypeReleaseXmlTempPayload
): Promise<Record<string, string>> {
  const project = await findProjectByQuery({ uuid });
  const { name, value, src } = data;
  const sourceRoot = path.join(
    pathUtil.SOURCE_CONFIG_DIR,
    path.dirname(project.sourceConfigPath)
  );
  const templateXml = path.join(sourceRoot, src);
  const releaseXml = path.join(project.projectRoot, src);
  const releaseFileIsExists = fse.pathExistsSync(releaseXml);

  // 节点操作
  let releaseElement = XmlTemplate.createEmptyNode().getElement();
  if (releaseFileIsExists) {
    releaseElement = new XmlFileCompiler(releaseXml).getElement();
  } else {
    const templateElement = new XmlFileCompiler(templateXml).getElement();
    const templateNode = new XmlTemplate(templateElement);
    templateNode.getRootNode().removeChildren();
    releaseElement = templateNode.getElement();
  }
  const templateElement = new XmlFileCompiler(templateXml).getElement();
  const templateNode = new XmlTemplate(templateElement);
  const releaseNode = new XmlTemplate(releaseElement);
  const templateRoot = templateNode.getRootNode();
  const releaseRoot = releaseNode.getRootNode();
  const fromNode = templateRoot.getFirstChildNodeByAttrValue("name", name);
  const targetNode = releaseRoot.getFirstChildNodeByAttrValue("name", name);
  // 空文件用模板替换
  if (releaseNode.isEmpty()) {
    templateRoot.removeChildren();
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
  const xmlElement = new XmlFileCompiler(data.src).getElement();
  return new XmlTemplate(xmlElement).getValueByName(data.name);
}
