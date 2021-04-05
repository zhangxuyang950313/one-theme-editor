import React from "react";
import { Form, FormItemProps, Input, Select } from "antd";
import { TypeUiVersion } from "@/types/project";

function getRuleNormalized(label: React.ReactNode) {
  return { required: true, message: `请输入${label || ""}` };
}

function getInputForm(props: FormItemProps) {
  return (
    <Form.Item
      {...props}
      rules={[getRuleNormalized(props.label), ...(props?.rules || [])]}
    >
      <Input placeholder={`请填写${props.label}`} />
    </Form.Item>
  );
}

function getSelectForm(
  props: FormItemProps,
  selectList: { value: string; label: string }[]
) {
  return (
    <Form.Item
      {...props}
      rules={[getRuleNormalized(props.label), ...(props?.rules || [])]}
    >
      <Select placeholder={`请选择${props.label || ""}`}>
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
export function ProjectName(): JSX.Element {
  return getInputForm({ label: "主题名称", name: "name" });
}

// 设计师
export function ProjectDesigner(): JSX.Element {
  return getInputForm({ label: "设计师", name: "designer" });
}

// 制作者
export function ProjectAuthor(): JSX.Element {
  return getInputForm({ label: "制作者", name: "author" });
}

// 版本
export function ProjectVersion(): JSX.Element {
  return getInputForm({ label: "版本", name: "version" });
}

// UI版本
export function ProjectUIVersion(props: {
  uiVersions: TypeUiVersion[];
}): JSX.Element {
  return getSelectForm(
    { label: "UI版本", name: "uiVersion" },
    props.uiVersions
      .filter(item => item.src && item.name)
      .map(item => ({
        value: item.src || "",
        label: item.name || ""
      }))
  );
}
