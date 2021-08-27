import React from "react";
import styled from "styled-components";

import { Radio } from "antd";
import { TypeSourceDefineValue } from "src/types/source";
import Wrapper from "./Wrapper";

const BooleanSelector: React.FC<{
  value: string;
  sourceDefine: TypeSourceDefineValue;
  onChange: (s: string) => void;
}> = props => {
  const { value, sourceDefine, onChange } = props;
  const { name, description, valueData } = sourceDefine;

  if (!valueData) return null;
  return (
    <Wrapper name={name} description={description}>
      <StyleBooleanSelector>
        <Radio.Group value={value} onChange={e => onChange(e.target.value)}>
          <Radio value="">跟随系统</Radio>
          <Radio value="true">true</Radio>
          <Radio value="false">false</Radio>
        </Radio.Group>
      </StyleBooleanSelector>
    </Wrapper>
  );
};

const StyleBooleanSelector = styled.div`
  display: flex;
  align-items: center;
`;

export default BooleanSelector;
