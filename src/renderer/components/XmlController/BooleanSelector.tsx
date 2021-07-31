import React, { useState } from "react";
import styled from "styled-components";

import { Radio } from "antd";
import { TypeSourceDefineValue } from "types/source-config";
import Wrapper from "./Wrapper";

const BooleanSelector: React.FC<{
  sourceDefineValue: TypeSourceDefineValue;
  onChange: (s: string) => void;
}> = props => {
  const { sourceDefineValue: sourceValueDefine, onChange } = props;
  const { name, description, valueData } = sourceValueDefine;
  const [value, setValue] = useState("");

  if (!valueData) return null;
  return (
    <Wrapper name={name} description={description}>
      <StyleBooleanSelector>
        <Radio.Group
          value={value}
          onChange={e => {
            setValue(e.target.value);
            onChange(e.target.value);
          }}
        >
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
