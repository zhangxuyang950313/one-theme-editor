import React, { useState } from "react";
import styled from "styled-components";
import { Input } from "antd";
import { RightCircleOutlined } from "@ant-design/icons";
import { TypeSourceDefineValue } from "types/source-config";
import Wrapper from "./Wrapper";

const StringInput: React.FC<{
  sourceDefineValue: TypeSourceDefineValue;
  onChange: (e: string) => void;
}> = props => {
  const { sourceDefineValue: sourceValueDefine, onChange } = props;
  const { name, description, valueData } = sourceValueDefine;
  const [value, setValue] = useState("");

  if (!valueData) return null;
  return (
    <Wrapper name={name} description={description}>
      <StyleNumberInput>
        <Input className="input" disabled value={valueData.defaultValue} />
        <RightCircleOutlined className="middle-button" />
        <Input
          className="input"
          value={value}
          onChange={e => {
            setValue(e.target.value);
            onChange(e.target.value);
          }}
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

export default StringInput;
