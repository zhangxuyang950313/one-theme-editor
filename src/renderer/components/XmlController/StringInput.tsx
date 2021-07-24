import React from "react";
import { Input } from "antd";
import { TypeSourceDefine } from "types/source-config";

const StringInput: React.FC<
  TypeSourceDefine & { onChange?: (e: string) => void }
> = props => {
  const { name, description, valueData } = props;
  if (!valueData) return null;
  return (
    <>
      <div>{description}</div>
      <span>{name}：</span>
      <Input
        style={{ width: "100px" }}
        value={valueData.defaultValue}
        onChange={val => props.onChange && props.onChange(val.target.value)}
      />
    </>
  );
};

export default StringInput;
