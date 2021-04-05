import React from "react";
import {
  Form,
  FormItemProps,
  Input,
  InputProps,
  Select,
  SelectProps
} from "antd";
import { TypeUiVersion } from "@/types/project";

function getRuleNormalized(label: React.ReactNode) {
  return { required: true, message: `请输入${label || ""}` };
}

function getInputForm(formItemProps: FormItemProps, inputProps: InputProps) {
  const rules = [
    getRuleNormalized(formItemProps.label),
    ...(formItemProps?.rules || [])
  ];
  return (
    <Form.Item
      {...formItemProps}
      rules={rules}
      shouldUpdate={(prevValues, currentValues) => prevValues !== currentValues}
    >
      <Input
        placeholder={`请填写${formItemProps.label}`}
        allowClear
        {...inputProps}
      />
    </Form.Item>
  );
}

function getSelectForm(
  props: FormItemProps,
  selectProps: SelectProps<any>,
  selectList: { value: string; label: string }[]
) {
  return (
    <Form.Item
      {...props}
      rules={[getRuleNormalized(props.label), ...(props?.rules || [])]}
      shouldUpdate={(prevValues, currentValues) => prevValues !== currentValues}
    >
      <Select
        placeholder={`请选择${props.label || ""}`}
        onChange={selectProps.onChange}
      >
        {selectList.map(item => (
          <Select.Option value={item.value} key={item.value}>
            {item.label}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
}

// 主题名称
export function ProjectName(inputProps: InputProps): JSX.Element {
  return getInputForm({ label: "主题名称", name: "name" }, inputProps);
}

// 设计师
export function ProjectDesigner(inputProps: InputProps): JSX.Element {
  return getInputForm({ label: "设计师名称", name: "designer" }, inputProps);
}

// 制作者
export function ProjectAuthor(inputProps: InputProps): JSX.Element {
  return getInputForm({ label: "制作者名称", name: "author" }, inputProps);
}

// 版本
export function ProjectVersion(inputProps: InputProps): JSX.Element {
  return getInputForm({ label: "版本号", name: "version" }, inputProps);
}

// UI版本
export function ProjectUIVersion(props: {
  uiVersions: TypeUiVersion[];
  onChange: SelectProps<any>["onChange"];
}): JSX.Element {
  return getSelectForm(
    { label: "UI版本", name: "uiVersion" },
    { onChange: props.onChange },
    props.uiVersions
      .filter(item => item.src && item.name)
      .map(item => ({
        value: item.src || "",
        label: item.name || ""
      }))
  );
}
