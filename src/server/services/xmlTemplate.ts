import path from "path";
import fse from "fs-extra";
import apiConfig from "src/constant/apiConf";
import pathUtil from "server/utils/pathUtil";
import XmlCompilerExtra from "server/compiler/XmlCompilerExtra";
import {
  TypeReleaseXmlTempPayload,
  UnionTupleToObjectKey
} from "src/types/request";
import XmlFileCompiler from "server/compiler/XmlFileCompiler";
import electronStore from "src/common/electronStore";
import XMLNodeElement from "server/compiler/XMLNodeElement";

/**
 * 输出被 key value 处理过模板字符串的 xml 模板
 * @param data
 */
export async function releaseXmlTemplate(
  data: TypeReleaseXmlTempPayload
): Promise<Record<string, string>> {
  const project = electronStore.get("projectData");
  const { tag, attributes, value, src } = data;
  const resourceXmlFile = path.join(
    pathUtil.RESOURCE_CONFIG_DIR,
    path.dirname(project.resourceSrc),
    src
  );
  const releaseXmlFile = path.join(project.root, src);
  // console.log({ resourceXmlFile });
  // 目标插入节点 node 备用
  const targetNode = XMLNodeElement.createEmptyElementNode(tag).setAttributes(
    Object.fromEntries(attributes)
  );
  const textNode = targetNode.getChildrenFirstTextNode();
  if (textNode.isEmpty) {
    targetNode.appendChild(
      XMLNodeElement.createTextNode().setTextNodeValue(value)
    );
  } else {
    textNode.setTextNodeValue(value);
  }

  // 节点操作
  let releaseNode = XmlCompilerExtra.createEmptyNode();
  // 模板文件存在
  if (fse.pathExistsSync(releaseXmlFile)) {
    releaseNode = XmlFileCompiler.from(releaseXmlFile);
  }
  // 模板 xml 实例
  const releaseXml = new XmlCompilerExtra(releaseNode.getElement());
  // 空文件用模板根节点替换
  if (releaseXml.isEmpty) {
    // console.log("空的", releaseXml);
    // 空模板节点
    const templateNode = XmlFileCompiler.from(resourceXmlFile);
    templateNode
      .getChildrenFirstElementNode()
      .removeChildren()
      .appendChild(targetNode);
    releaseXml.setElement(templateNode.getElement());
    // console.log(releaseXml);
    // console.log(templateNode);
  } else {
    // console.log("非空");
    let hasMatched = false;
    const elementNode = releaseXml.getChildrenFirstElementNode();

    // console.log(elementNode);
    elementNode.getChildrenNodes().forEach(item => {
      console.log(item);
      const nodeKey = JSON.stringify({
        tag: item.getTagname(),
        attributes: item.getAttributeEntries()
      });
      const targetKey = JSON.stringify({ tag, attributes });
      // console.log({ nodeKey, targetKey });
      if (nodeKey === targetKey) {
        const textNode = item.getChildrenFirstTextNode();
        if (textNode.isEmpty) {
          item.appendChild(
            XMLNodeElement.createTextNode().setTextNodeValue(value)
          );
        } else {
          textNode.setTextNodeValue(value);
        }
        hasMatched = true;
        // console.log("set success", item);
      }
    });
    // 从未匹配到则新增一条
    if (!hasMatched) {
      elementNode.appendChild(targetNode);
    }
  }
  // 构建 xml 并写入文件
  const xmlStr = releaseXml.buildXml();
  fse.ensureDirSync(path.dirname(releaseXmlFile));
  fse.writeFileSync(releaseXmlFile, xmlStr);
  return { value: value, release: releaseXmlFile };
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
