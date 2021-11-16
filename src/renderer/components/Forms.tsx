import React from "react";
import {
  Form,
  FormItemProps,
  Input,
  InputProps,
  Select,
  SelectProps
} from "@arco-design/web-react";

import { projectInfoConfig } from "@/config/editor";

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
      rules={rules}
      shouldUpdate={(prevValues, currentValues) => prevValues !== currentValues}
      {...formItemProps}
    >
      <Input
        placeholder={`请填写${formItemProps.label || ""}`}
        allowClear
        {...inputProps}
      />
    </Form.Item>
  );
}

function getSelectForm(
  props: FormItemProps,
  selectProps: SelectProps,
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

//
export function ProjectInput(
  props: { label: string; field: string } & InputProps
): JSX.Element {
  const { label, field } = props;
  return getInputForm({ label, field }, props);
}

// 主题名称
export function ProjectName(inputProps: InputProps): JSX.Element {
  const { name: label, key: field } = projectInfoConfig.name;
  return getInputForm({ label, field }, inputProps);
}

// 设计师
export function ProjectDesigner(inputProps: InputProps): JSX.Element {
  const { name: label, key: field } = projectInfoConfig.designer;
  return getInputForm({ label, field }, inputProps);
}

// 制作者
export function ProjectAuthor(inputProps: InputProps): JSX.Element {
  const { name: label, key: field } = projectInfoConfig.author;
  return getInputForm({ label, field }, inputProps);
}

// 版本
export function ProjectVersion(inputProps: InputProps): JSX.Element {
  const { name: label, key: field } = projectInfoConfig.version;
  return getInputForm({ label, field }, inputProps);
}

/**
 * @deprecated
 * UI版本
 * @param props
 * @returns
 */
export function ProjectUIVersion(props: {
  uiVersions: Array<{ code: string; field: string }>;
  onChange: SelectProps["onChange"];
}): JSX.Element {
  const { name: label, key: field } = projectInfoConfig.uiVersion;
  return getSelectForm(
    { label, field },
    { onChange: props.onChange },
    props.uiVersions.map(item => ({
      value: item.code || "",
      label: item.field || ""
    }))
  );
}

// 本地路径
export const ProjectLocalDir: React.FC<InputProps> = props => {
  const label = "本地目录";
  const field = "local";
  return getInputForm({ label, field }, props);
};

// 输入颜色
export const ColorInput: React.FC<InputProps> = props => {
  return getInputForm({}, { ...props, placeholder: "输入颜色" });
};
