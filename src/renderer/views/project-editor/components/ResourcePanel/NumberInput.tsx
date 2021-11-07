import React from "react";
import styled from "styled-components";
import { InputNumber } from "@arco-design/web-react";
import { IconRight } from "@arco-design/web-react/icon";

const NumberInput: React.FC<{
  defaultValue: string;
  value: string;
  onChange: (val: string) => void;
}> = props => {
  const { defaultValue, value, onChange } = props;

  return (
    <StyleNumberInput>
      <div className="content-wrapper">
        <InputNumber disabled className="input" value={defaultValue} />
        <IconRight
          className="middle-button"
          onClick={() => onChange(defaultValue)}
        />
        <InputNumber
          className="input"
          placeholder={defaultValue}
          value={value}
          onChange={val => {
            if (isNaN(Number(val))) return;
            onChange(String(val));
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
    color: var(--color-text-3);
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
    color: rgba(var(--red-5));
    font-size: 11px;
  }
`;

export default NumberInput;
