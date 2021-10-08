import React from "react";
import styled from "styled-components";
import { InputNumber } from "antd";
import { RightCircleOutlined } from "@ant-design/icons";
import { TypeResXmlValDefinition } from "src/types/resource";
import Wrapper from "./Wrapper";

const NumberInput: React.FC<{
  value: string;
  valueDefinition: TypeResXmlValDefinition;
  onChange: (e: string) => void;
}> = props => {
  const { value, valueDefinition, onChange } = props;
  const { name, desc, sourceData } = valueDefinition;
  const { defaultValue } = sourceData.data;

  return (
    <Wrapper name={name} description={desc}>
      <StyleNumberInput>
        <InputNumber disabled keyboard className="input" value={defaultValue} />
        <RightCircleOutlined
          className="middle-button"
          onClick={() => onChange(defaultValue)}
        />
        <InputNumber
          keyboard
          className="input"
          placeholder="缺省"
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
