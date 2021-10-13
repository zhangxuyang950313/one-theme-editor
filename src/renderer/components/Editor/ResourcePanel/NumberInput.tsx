import React from "react";
import styled from "styled-components";
import { InputNumber } from "antd";

const NumberInput: React.FC<{
  value: string;
  onChange: (e: string) => void;
}> = props => {
  const { value, onChange } = props;

  return (
    <StyleNumberInput>
      {/* <InputNumber disabled keyboard className="input" value={value} />
      <RightCircleOutlined
        className="middle-button"
        onClick={() => onChange(value)}
      /> */}
      <InputNumber
        keyboard
        className="input"
        placeholder="缺省"
        value={value}
        onChange={val => {
          if (isNaN(Number(val))) return;
          onChange(val);
        }}
      />
      {isNaN(Number(value)) && (
        <div className="error">{`非合法数字类型("${value}")`}</div>
      )}
    </StyleNumberInput>
  );
};

const StyleNumberInput = styled.div`
  display: flex;
  flex-direction: column;
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
