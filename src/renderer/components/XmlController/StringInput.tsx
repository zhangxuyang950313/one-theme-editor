import React from "react";
import { Input } from "antd";
import { TypePageValueDefine } from "types/source-config";

const StringInput: React.FC<
  TypePageValueDefine & { onChange?: (e: string) => void }
> = props => {
  const { name, description, valueData } = props;
  const { defaultValue } = valueData;
  return (
    <>
      <div>{description}</div>
      <span>{name}：</span>
      <Input
        style={{ width: "100px" }}
        value={defaultValue}
        onChange={val => props.onChange && props.onChange(val.target.value)}
      />
    </>
  );
};

export default StringInput;