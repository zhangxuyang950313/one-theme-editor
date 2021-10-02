import React from "react";
import styled from "styled-components";

import { Radio } from "antd";
import { TypeResXmlDefinition } from "src/types/resource";
import Wrapper from "./Wrapper";

const BooleanSelector: React.FC<{
  value: string;
  valueDefinition: TypeResXmlDefinition;
  onChange: (s: string) => void;
}> = props => {
  const { value, valueDefinition, onChange } = props;
  const { name, desc: description, data } = valueDefinition;

  if (!data) return null;
  return (
    <Wrapper name={name} description={description}>
      <StyleBooleanSelector>
        <Radio.Group value={value} onChange={e => onChange(e.target.value)}>
          <Radio value="">缺省</Radio>
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
