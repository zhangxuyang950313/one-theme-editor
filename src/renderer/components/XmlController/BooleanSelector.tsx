import React from "react";
import styled from "styled-components";

import { Radio, RadioChangeEvent } from "antd";
import { TypeSourceDefine } from "types/source-config";
import Wrapper from "./Wrapper";

const BooleanSelector: React.FC<
  TypeSourceDefine & { onChange?: (s: RadioChangeEvent) => void }
> = props => {
  const { name, description, valueData } = props;
  if (!valueData) return null;
  return (
    <Wrapper name={name} description={description}>
      <StyleBooleanSelector>
        <Radio.Group
          value={valueData.defaultValue}
          onChange={e => props.onChange && props.onChange(e)}
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
