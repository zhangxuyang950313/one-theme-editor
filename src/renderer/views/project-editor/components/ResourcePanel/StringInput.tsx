import React from "react";
import styled from "styled-components";
import { Input } from "@arco-design/web-react";
import { IconRight } from "@arco-design/web-react/icon";

const StringInput: React.FC<{
  defaultValue: string;
  value: string;
  onChange: (e: string) => void;
}> = props => {
  const { defaultValue, value, onChange } = props;
  return (
    <StyleNumberInput>
      <Input className="input" disabled value={defaultValue} />
      <IconRight
        className="middle-button"
        onClick={() => onChange(defaultValue)}
      />
      <Input
        className="input"
        placeholder={defaultValue}
        value={value}
        onChange={value => onChange(value)}
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

export default StringInput;
