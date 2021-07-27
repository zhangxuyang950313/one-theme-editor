import React from "react";
import styled from "styled-components";
import { Input } from "antd";
import { RightCircleOutlined } from "@ant-design/icons";
import { TypeSourceDefine } from "types/source-config";
import Wrapper from "./Wrapper";

const StringInput: React.FC<
  TypeSourceDefine & { onChange?: (e: string) => void }
> = props => {
  const { name, description, valueData } = props;
  if (!valueData) return null;
  return (
    <Wrapper name={name} description={description}>
      <StyleNumberInput>
        <Input
          className="input"
          disabled
          value={valueData.defaultValue}
          onChange={val => props.onChange && props.onChange(val.target.value)}
        />
        <RightCircleOutlined className="middle-button" />
        <Input
          className="input"
          value={valueData.defaultValue}
          onChange={val => props.onChange && props.onChange(val.target.value)}
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
