import path from "path";
import fse from "fs-extra";
import pathUtil from "src/common/utils/pathUtil";
import XmlFileCompiler from "src/common/compiler/XmlFileCompiler";
import XMLNodeElement from "src/common/compiler/XMLNodeElement";
import { TypeWriteXmlTempPayload } from "src/types/request";

/**
 * 输出被 key value 处理过模板字符串的 xml 模板
 * @param data
 */
export async function writeXmlTemplate(
  data: TypeWriteXmlTempPayload
): Promise<Record<string, string>> {
  const project = $reactiveState.get("projectData");
  const { tag, attributes, value, src } = data;
  const resourceXmlFile = path.join(
    pathUtil.RESOURCE_CONFIG_DIR,
    path.dirname(project.resourceSrc),
    src
  );
  const releaseXmlFile = path.join(project.root, src);

  // 确保存在文件
  fse.ensureDirSync(path.dirname(releaseXmlFile));
  fse.ensureFileSync(releaseXmlFile);

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

  const releaseXml = XmlFileCompiler.from(releaseXmlFile);

  // 职责链
  const duty = {
    // 文件存在但为空
    fileIsEmpty() {
      const templateNode = XmlFileCompiler.from(resourceXmlFile);
      templateNode
        .getChildrenFirstElementNode()
        .removeChildren()
        .appendChild(targetNode);
      releaseXml.setElement(templateNode.getElement());
    },
    // 文件有内容
    fileHasContent() {
      let hasMatched = false;
      const elementNode = releaseXml.getChildrenFirstElementNode();
      elementNode.getChildrenNodes().forEach(item => {
        const nodeKey = JSON.stringify({
          tag: item.getTagname(),
          attributes: item.getAttributeEntries()
        });
        const targetKey = JSON.stringify({ tag, attributes });
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
        }
      });
      // 从未匹配到则新增一条
      if (!hasMatched) {
        elementNode.appendChild(targetNode);
      }
    }
  };

  // 策略模式
  if (releaseXml.isEmpty) {
    duty.fileIsEmpty();
  } else {
    duty.fileHasContent();
  }

  // 构建 xml 并写入文件
  const xmlStr = releaseXml.buildXml();
  fse.writeFileSync(releaseXmlFile, xmlStr);
  return { value, release: releaseXmlFile };
}
