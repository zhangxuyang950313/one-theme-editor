import React from "react";
import styled from "styled-components";
import { Input } from "antd";
import { RightCircleOutlined } from "@ant-design/icons";
import { TypeSourceValueDefined } from "src/types/source";
import Wrapper from "./Wrapper";

const StringInput: React.FC<{
  value: string;
  sourceDefine: TypeSourceValueDefined;
  onChange: (e: string) => void;
}> = props => {
  const { value, sourceDefine, onChange } = props;
  const { name, description, valueData } = sourceDefine;

  if (!valueData) return null;
  const { defaultValue } = valueData;
  return (
    <Wrapper name={name} description={description}>
      <StyleNumberInput>
        <Input className="input" disabled value={defaultValue} />
        <RightCircleOutlined
          className="middle-button"
          onClick={() => onChange(defaultValue)}
        />
        <Input
          className="input"
          value={value}
          onChange={e => {
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
