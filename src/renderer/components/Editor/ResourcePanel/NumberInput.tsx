import React from "react";
import styled from "styled-components";
import { InputNumber } from "antd";
import { RightCircleOutlined } from "@ant-design/icons";

const NumberInput: React.FC<{
  value: string;
  onChange: (e: string) => void;
}> = props => {
  const { value, onChange } = props;

  return (
    <StyleNumberInput>
      <InputNumber disabled keyboard className="input" value={value} />
      <RightCircleOutlined
        className="middle-button"
        onClick={() => onChange(value)}
      />
      <InputNumber
        keyboard
        className="input"
        placeholder="缺省"
        value={value}
        onChange={onChange}
      />
    </StyleNumberInput>
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
