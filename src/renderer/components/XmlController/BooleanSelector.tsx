import React from "react";

import { Radio, RadioChangeEvent } from "antd";
import { TypePageValueDefine } from "types/source-config";

const BooleanSelector: React.FC<
  TypePageValueDefine & { onChange?: (s: RadioChangeEvent) => void }
> = props => {
  const { name, description, valueData } = props;
  if (!valueData) return null;
  const { defaultValue } = valueData;
  return (
    <>
      <div>{description}</div>
      <span>{name}：</span>
      <Radio.Group
        style={{ display: "flex" }}
        value={defaultValue}
        onChange={e => props.onChange && props.onChange(e)}
      >
        <Radio value="">跟随系统</Radio>
        <Radio value="true">true</Radio>
        <Radio value="false">false</Radio>
      </Radio.Group>
    </>
  );
};

export default BooleanSelector;
