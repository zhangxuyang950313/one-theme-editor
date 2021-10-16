import React from "react";
import styled from "styled-components";
import { InputNumber } from "antd";
import { RightCircleOutlined } from "@ant-design/icons";

const NumberInput: React.FC<{
  defaultValue: string;
  value: string;
  onChange: (val: string) => void;
}> = props => {
  const { defaultValue, value, onChange } = props;

  return (
    <StyleNumberInput>
      <div className="content-wrapper">
        <InputNumber disabled keyboard className="input" value={defaultValue} />
        <RightCircleOutlined
          className="middle-button"
          onClick={() => onChange(defaultValue)}
        />
        <InputNumber
          keyboard
          className="input"
          placeholder={defaultValue}
          value={value}
          onChange={val => {
            if (isNaN(Number(val))) return;
            onChange(val);
          }}
        />
      </div>
      {isNaN(Number(value)) && (
        <div className="error">{`非合法数字类型("${value}")`}</div>
      )}
    </StyleNumberInput>
  );
};

const StyleNumberInput = styled.div`
  display: flex;
  flex-direction: column;
  .content-wrapper {
    display: flex;
    align-items: center;
  }
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
  .error {
    color: ${({ theme }) => theme["@error-color"]};
    font-size: ${({ theme }) => theme["@text-size-thirdly"]};
  }
`;

export default NumberInput;
