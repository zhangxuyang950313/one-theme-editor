import React from "react";
import styled from "styled-components";
import { Radio } from "antd";

const BooleanSelector: React.FC<{
  value: string;
  onChange: (s: string) => void;
}> = props => {
  const { value, onChange } = props;

  return (
    <StyleBooleanSelector>
      <Radio.Group value={value} onChange={e => onChange(e.target.value)}>
        <Radio value="">缺省</Radio>
        <Radio value="true">true</Radio>
        <Radio value="false">false</Radio>
      </Radio.Group>
      {!["true", "false", ""].includes(value) && (
        <div className="error">{`非合法布尔值("${value}")，应为"true"或"false"或缺省("")`}</div>
      )}
    </StyleBooleanSelector>
  );
};

const StyleBooleanSelector = styled.div`
  display: flex;
  align-items: center;
  .error {
    color: ${({ theme }) => theme["@error-color"]};
    font-size: ${({ theme }) => theme["@text-size-thirdly"]};
  }
`;

export default BooleanSelector;
