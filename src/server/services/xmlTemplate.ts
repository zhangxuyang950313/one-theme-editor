import path from "path";
import fse from "fs-extra";
import apiConfig from "src/constant/apiConf";
import pathUtil from "server/utils/pathUtil";
import XmlCompilerExtra from "server/compiler/XmlCompilerExtra";
import {
  TypeReleaseXmlTempPayload,
  UnionTupleToObjectKey
} from "src/types/request";
import { findProjectByQuery } from "server/dbHandler/project";
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
  const { tag, attributes, value, src } = data;
  const resourceRoot = path.join(
    pathUtil.RESOURCE_CONFIG_DIR,
    path.dirname(project.resourceSrc)
  );
  const templateXmlFile = path.join(resourceRoot, src);
  const releaseXmlFile = path.join(project.root, src);

  const templateElement = new XmlFileCompiler(templateXmlFile).getElement();
  const templateXml = new XmlCompilerExtra(templateElement);

  // 节点操作
  let releaseElement = XmlCompilerExtra.createEmptyNode().getElement();
  if (fse.pathExistsSync(releaseXmlFile)) {
    releaseElement = new XmlFileCompiler(releaseXmlFile).getElement();
  } else {
    templateXml.getFirstChildNode().removeChildren();
    releaseElement = templateXml.getElement();
  }
  const releaseXml = new XmlCompilerExtra(releaseElement);
  const fromNode = templateXml.findNodeByTagAndAttributes(tag, attributes);
  const targetNode = releaseXml.findNodeByTagAndAttributes(tag, attributes);
  // 空文件用模板替换
  if (releaseXml.isEmpty()) {
    templateXml.getFirstChildNode().removeChildren();
    releaseXml.setNode(templateXml);
  }
  // 创建 text value 并替换子节点
  if (fromNode.isEmpty()) {
    const nodeTemp = XmlCompilerExtra.createEmptyElementNode()
      .setTagname(tag)
      .setAttributes(Object.fromEntries(attributes));
    const xmlTemp = XmlCompilerExtra.createEmptyRootNode(false)
      .appendChild(nodeTemp)
      .buildXml();
    throw new Error(`模板中不存在：${xmlTemp}`);
  }
  fromNode
    .getFirstChildNode()
    .replaceNode(XmlCompilerExtra.createTextNode(value));
  // 插入工程文件
  if (targetNode.isEmpty()) {
    const releaseRoot = releaseXml.getFirstChildNode();
    releaseRoot.appendChild(fromNode);
  } else {
    targetNode.replaceNode(fromNode);
  }
  const xmlStr = releaseXml.buildXml();
  fse.ensureDirSync(path.dirname(releaseXmlFile));
  fse.writeFileSync(releaseXmlFile, xmlStr);
  return { uuid, value: value, release: releaseXmlFile };
}

/**
 * 获取 xml 模板 name 属性值对应的 text value
 * @param data
 * @returns
 */
export function getXmlTempValueByNameAttrVal(
  data: UnionTupleToObjectKey<typeof apiConfig.GET_XML_TEMP_VALUE.query>
): string {
  const xmlElement = new XmlFileCompiler(data.src).getElement();
  return new XmlCompilerExtra(xmlElement).getValueByName(data.name);
}
