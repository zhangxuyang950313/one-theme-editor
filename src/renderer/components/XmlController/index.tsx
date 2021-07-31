import React from "react";
import styled from "styled-components";
import { TypeSourceDefineValue } from "types/source-config";
import { apiOutputXmlTemplate } from "@/request";
import { useProjectUUID } from "@/hooks/project";
import { useProjectFileWatcher } from "@/hooks/fileWatcher";
import { SOURCE_TYPES } from "enum/index";

import { notification } from "antd";
import ERR_CODE from "@/../common/errorCode";
import ColorPicker from "./ColorPicker";
import BooleanSelector from "./BooleanSelector";
import NumberInput from "./NumberInput";
import StringInput from "./StringInput";

const XmlController: React.FC<{
  sourceType: SOURCE_TYPES;
  sourceDefineValue: TypeSourceDefineValue;
}> = props => {
  const { sourceType, sourceDefineValue } = props;
  const uuid = useProjectUUID();

  useProjectFileWatcher(sourceDefineValue.valueData?.src || "", () => {
    //
  });

  const Controllers = () => {
    // 写入 xml
    const writeXml = (value: string) => {
      if (!sourceDefineValue.valueData) {
        notification.warn({ message: ERR_CODE[4008] });
        return;
      }

      apiOutputXmlTemplate(uuid, {
        name: sourceDefineValue.name,
        value,
        src: sourceDefineValue.valueData.src
      });
    };
    switch (sourceType) {
      // 颜色选择器
      case SOURCE_TYPES.COLOR: {
        return (
          <ColorPicker
            sourceDefineValue={sourceDefineValue}
            onChange={writeXml}
          />
        );
      }
      // 布尔选择器
      case SOURCE_TYPES.BOOLEAN: {
        return (
          <BooleanSelector
            sourceDefineValue={sourceDefineValue}
            onChange={writeXml}
          />
        );
      }
      // 数字输入器
      case SOURCE_TYPES.NUMBER: {
        return (
          <NumberInput
            sourceDefineValue={sourceDefineValue}
            onChange={writeXml}
          />
        );
      }
      // 未注明的都使用通用的字符串输入器
      case SOURCE_TYPES.STRING:
      default: {
        return (
          <StringInput
            sourceDefineValue={sourceDefineValue}
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
