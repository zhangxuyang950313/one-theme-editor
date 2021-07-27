import React from "react";
import styled from "styled-components";
import { InputNumber } from "antd";
import { RightCircleOutlined } from "@ant-design/icons";
import { TypeSourceDefine } from "types/source-config";
import Wrapper from "./Wrapper";

const NumberInput: React.FC<
  TypeSourceDefine & {
    onChange?: (e: string) => void;
  }
> = props => {
  const { name, description, valueData } = props;
  if (!valueData) return null;

  return (
    <Wrapper name={name} description={description}>
      <StyleNumberInput>
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
      </StyleNumberInput>
    </Wrapper>
  );
};

const StyleNumberInput = styled.div`
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
`;

export default NumberInput;
