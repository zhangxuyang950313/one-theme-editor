import React from "react";
import styled from "styled-components";

import { Radio } from "antd";
import { TypeResXmlValDefinition } from "src/types/resource";
import Wrapper from "./Wrapper";

const BooleanSelector: React.FC<{
  value: string;
  valueDefinition: TypeResXmlValDefinition;
  onChange: (s: string) => void;
}> = props => {
  const { value, valueDefinition, onChange } = props;
  const { name, desc } = valueDefinition;

  return (
    <Wrapper name={name} description={desc}>
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
