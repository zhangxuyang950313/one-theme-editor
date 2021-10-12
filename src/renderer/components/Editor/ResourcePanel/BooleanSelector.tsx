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
    </StyleBooleanSelector>
  );
};

const StyleBooleanSelector = styled.div`
  display: flex;
  align-items: center;
`;

export default BooleanSelector;
