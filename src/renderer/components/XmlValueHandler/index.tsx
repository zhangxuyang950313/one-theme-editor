import React from "react";
import styled from "styled-components";
import { TypeResXmlValDefinition } from "src/types/resource";
import { apiWriteXmlTemplate } from "@/request";
import { useProjectUUID, useProjectXmlValueBySrc } from "@/hooks/project/index";
import { RESOURCE_TYPE } from "src/enum/index";

import ColorPicker from "./ColorPicker";
import BooleanSelector from "./BooleanSelector";
import NumberInput from "./NumberInput";
import StringInput from "./StringInput";

const XmlValueHandler: React.FC<{
  xmlValueDefinition: TypeResXmlValDefinition;
}> = props => {
  const { resType, name, sourceData } = props.xmlValueDefinition;
  const uuid = useProjectUUID();
  const value = useProjectXmlValueBySrc(name, sourceData.src);

  // 分类编辑控件
  const CategoryHandler = () => {
    // 写入 xml
    const writeXml = (value: string) => {
      const name = sourceData.data.valueName;
      apiWriteXmlTemplate(uuid, { name, value, src: sourceData.src });
    };
    switch (resType) {
      // 颜色选择器
      case RESOURCE_TYPE.COLOR: {
        return (
          <ColorPicker
            value={value}
            valueDefinition={props.xmlValueDefinition}
            onChange={writeXml}
          />
        );
      }
      // 布尔选择器
      case RESOURCE_TYPE.BOOLEAN: {
        return (
          <BooleanSelector
            value={value}
            valueDefinition={props.xmlValueDefinition}
            onChange={writeXml}
          />
        );
      }
      // 数字输入器
      case RESOURCE_TYPE.NUMBER: {
        return (
          <NumberInput
            value={value}
            valueDefinition={props.xmlValueDefinition}
            onChange={writeXml}
          />
        );
      }
      // 未注明的都使用通用的字符串输入器
      case RESOURCE_TYPE.STRING:
      default: {
        return (
          <StringInput
            value={value}
            valueDefinition={props.xmlValueDefinition}
            onChange={writeXml}
          />
        );
      }
    }
  };
  return (
    <StyleXmlController>
      <CategoryHandler />
    </StyleXmlController>
  );
};

const StyleXmlController = styled.div`
  flex-shrink: 0;
  box-sizing: content-box;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid;
  border-bottom-color: ${({ theme }) => theme["@border-color-base"]};
`;

export default XmlValueHandler;
