import React from "react";
import { InputNumber } from "antd";
import { TypeSourceDefine } from "types/source-config";

const NumberInput: React.FC<
  TypeSourceDefine & {
    onChange?: (e: string) => void;
  }
> = props => {
  const { name, description, valueData } = props;
  if (!valueData) return null;

  return (
    <>
      <div>{description}</div>
      <span>{name}：</span>
      <InputNumber keyboard value={valueData.defaultValue} />
    </>
  );
};

export default NumberInput;
