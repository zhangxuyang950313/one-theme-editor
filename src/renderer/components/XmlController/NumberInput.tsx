import React from "react";
import styled from "styled-components";
import { InputNumber } from "antd";
import { RightCircleOutlined } from "@ant-design/icons";
import { TypeSourceDefine } from "types/source-config";

const NumberInput: React.FC<
  TypeSourceDefine & {
    onChange?: (e: string) => void;
  }
> = props => {
  const { name, description, valueData } = props;
  if (!valueData) return null;

  return (
    <StyleNumberInput>
      <div className="text-wrapper">
        <span className="description">{description}</span>
        <span className="value-name">{name}</span>
      </div>
      <div className="value-wrapper">
        <InputNumber
          disabled
          keyboard
          className="input"
          value={valueData.defaultValue}
        />
        <RightCircleOutlined className="middle-button" />
        <InputNumber
          keyboard
          className="input"
          value={valueData.defaultValue}
        />
      </div>
    </StyleNumberInput>
  );
};

const StyleNumberInput = styled.div`
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
    .value-name {
      user-select: text;
      margin: 10px 0;
      font-size: ${({ theme }) => theme["@text-size-secondary"]};
      color: ${({ theme }) => theme["@text-color-secondary"]};
    }
  }
  .value-wrapper {
    display: flex;
    align-items: center;
    .middle-button {
      cursor: pointer;
      color: ${({ theme }) => theme["@text-color-secondary"]};
      font-size: 20px;
      margin: 10px;
      transition: all 0.3s;
      &:hover {
        opacity: 0.5;
      }
    }
    .input {
      width: 100px;
    }
  }
`;

export default NumberInput;
