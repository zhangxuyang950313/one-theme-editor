import React from "react";
import styled from "styled-components";

import { Radio, RadioChangeEvent } from "antd";
import { TypeSourceDefine } from "types/source-config";

const BooleanSelector: React.FC<
  TypeSourceDefine & { onChange?: (s: RadioChangeEvent) => void }
> = props => {
  const { name, description, valueData } = props;
  if (!valueData) return null;
  return (
    <StyleBooleanSelector>
      <div className="text-wrapper">
        <span className="description">{description}</span>
        <span className="bool-name">{name}</span>
      </div>
      <Radio.Group
        className="bool-wrapper"
        value={valueData.defaultValue}
        onChange={e => props.onChange && props.onChange(e)}
      >
        <Radio value="">跟随系统</Radio>
        <Radio value="true">true</Radio>
        <Radio value="false">false</Radio>
      </Radio.Group>
    </StyleBooleanSelector>
  );
};

const StyleBooleanSelector = styled.div`
  flex-shrink: 0;
  box-sizing: content-box;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid;
  border-bottom-color: ${({ theme }) => theme["@border-color-base"]};
  .text-wrapper {
    display: flex;
    flex-direction: column;
    .description {
      font-size: ${({ theme }) => theme["@text-size-main"]};
      color: ${({ theme }) => theme["@text-color"]};
    }
    .bool-name {
      user-select: text;
      margin: 10px 0;
      font-size: ${({ theme }) => theme["@text-size-secondary"]};
      color: ${({ theme }) => theme["@text-color-secondary"]};
    }
  }
  .bool-wrapper {
    display: flex;
    align-items: center;
  }
`;

export default BooleanSelector;
