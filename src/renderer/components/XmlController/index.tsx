import React, { useState } from "react";
import styled from "styled-components";
import { TypeSourceDefineValue } from "types/source";
import { apiGetTempValueByName, apiOutputXmlTemplate } from "@/request";
import { useProjectUUID } from "@/hooks/project";
import { useProjectFileWatcher } from "@/hooks/fileWatcher";
import { SOURCE_TYPES } from "enum/index";

import ColorPicker from "./ColorPicker";
import BooleanSelector from "./BooleanSelector";
import NumberInput from "./NumberInput";
import StringInput from "./StringInput";

const XmlController: React.FC<{
  sourceType: SOURCE_TYPES;
  sourceDefineValue: TypeSourceDefineValue;
}> = props => {
  const { sourceType, sourceDefineValue } = props;
  const { valueData } = sourceDefineValue;
  const uuid = useProjectUUID();
  const [value, setValue] = useState("");

  useProjectFileWatcher(valueData?.src || "", file => {
    if (!valueData?.valueName) return;
    console.log("get", valueData.valueName);
    apiGetTempValueByName({
      uuid,
      name: valueData.valueName,
      src: valueData.src
    }).then(setValue);
  });

  if (!valueData) return null;

  const Controllers = () => {
    // 写入 xml
    const writeXml = (value: string) => {
      apiOutputXmlTemplate(uuid, {
        name: valueData.valueName,
        value,
        src: valueData.src
      });
    };
    switch (sourceType) {
      // 颜色选择器
      case SOURCE_TYPES.COLOR: {
        return (
          <ColorPicker
            value={value}
            sourceDefine={sourceDefineValue}
            onChange={writeXml}
          />
        );
      }
      // 布尔选择器
      case SOURCE_TYPES.BOOLEAN: {
        return (
          <BooleanSelector
            value={value}
            sourceDefine={sourceDefineValue}
            onChange={writeXml}
          />
        );
      }
      // 数字输入器
      case SOURCE_TYPES.NUMBER: {
        return (
          <NumberInput
            value={value}
            sourceDefine={sourceDefineValue}
            onChange={writeXml}
          />
        );
      }
      // 未注明的都使用通用的字符串输入器
      case SOURCE_TYPES.STRING:
      default: {
        return (
          <StringInput
            value={value}
            sourceDefine={sourceDefineValue}
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
