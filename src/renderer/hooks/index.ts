import { InputProps } from "antd";
import { useCallback, useEffect, useState } from "react";

// 设置页面标题
export function useDocumentTitle(title: string): string {
  useEffect(() => {
    document.title = title;
    return () => {
      document.title = "一个主题编辑器";
    };
  }, [title]);
  return document.title;
}

// 获取输入的值
type TypeUseInputValueReturn = {
  value: string;
  onChange: InputProps["onChange"];
};
export function useInputValue(initialValue: string): TypeUseInputValueReturn {
  const [value, setValue] = useState(initialValue);
  const onInputChange: InputProps["onChange"] = event => {
    setValue(event.currentTarget.value);
  };
  const onChange = useCallback(onInputChange, []);
  return { value, onChange };
}
