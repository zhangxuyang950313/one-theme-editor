import React from "react";
import styled from "styled-components";
import { TypeResXmlDefinition } from "src/types/resource";
import { apiWriteXmlTemplate } from "@/request";
import { useProjectUUID, useProjectXmlValueBySrc } from "@/hooks/project/index";
import { RESOURCE_TYPES } from "src/enum/index";

import ColorPicker from "./ColorPicker";
import BooleanSelector from "./BooleanSelector";
import NumberInput from "./NumberInput";
import StringInput from "./StringInput";

const XmlController: React.FC<{
  resourceType: RESOURCE_TYPES;
  valueDefinition: TypeResXmlDefinition;
}> = props => {
  const { resourceType, valueDefinition } = props;
  const { name, src, data } = valueDefinition;
  const uuid = useProjectUUID();
  const value = useProjectXmlValueBySrc(name, src);

  if (!data) return null;

  const Controllers = () => {
    // 写入 xml
    const writeXml = (value: string) => {
      const name = data.valueName;
      apiWriteXmlTemplate(uuid, { name, value, src });
    };
    switch (resourceType) {
      // 颜色选择器
      case RESOURCE_TYPES.COLOR: {
        return (
          <ColorPicker
            value={value}
            valueDefinition={valueDefinition}
            onChange={writeXml}
          />
        );
      }
      // 布尔选择器
      case RESOURCE_TYPES.BOOLEAN: {
        return (
          <BooleanSelector
            value={value}
            valueDefinition={valueDefinition}
            onChange={writeXml}
          />
        );
      }
      // 数字输入器
      case RESOURCE_TYPES.NUMBER: {
        return (
          <NumberInput
            value={value}
            valueDefinition={valueDefinition}
            onChange={writeXml}
          />
        );
      }
      // 未注明的都使用通用的字符串输入器
      case RESOURCE_TYPES.STRING:
      default: {
        return (
          <StringInput
            value={value}
            valueDefinition={valueDefinition}
            onChange={writeXml}
          />
        );
      }
    }
  };
  return (
    <StyleXmlController>
      <Controllers />
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

export default XmlController;
