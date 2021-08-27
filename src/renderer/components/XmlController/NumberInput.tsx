import React from "react";
import styled from "styled-components";
import { InputNumber } from "antd";
import { RightCircleOutlined } from "@ant-design/icons";
import { TypeSourceDefineValue } from "src/types/source";
import Wrapper from "./Wrapper";

const NumberInput: React.FC<{
  value: string;
  sourceDefine: TypeSourceDefineValue;
  onChange: (e: string) => void;
}> = props => {
  const { value, sourceDefine, onChange } = props;
  const { name, description, valueData } = sourceDefine;

  if (!valueData) return null;
  const { defaultValue } = valueData;

  return (
    <Wrapper name={name} description={description}>
      <StyleNumberInput>
        <InputNumber disabled keyboard className="input" value={defaultValue} />
        <RightCircleOutlined
          className="middle-button"
          onClick={() => onChange(defaultValue)}
        />
        <InputNumber
          keyboard
          className="input"
          value={value}
          onChange={onChange}
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
