import React from "react";
import styled from "styled-components";
import { Input } from "antd";
import { RightCircleOutlined } from "@ant-design/icons";

const StringInput: React.FC<{
  value: string;
  onChange: (e: string) => void;
}> = props => {
  const { value, onChange } = props;
  return (
    <StyleNumberInput>
      <Input className="input" disabled value={value} />
      <RightCircleOutlined
        className="middle-button"
        onClick={() => onChange(value)}
      />
      <Input
        className="input"
        placeholder="缺省"
        value={value}
        onChange={e => onChange(e.target.value)}
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
