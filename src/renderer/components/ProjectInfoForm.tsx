import React, { forwardRef, useImperativeHandle } from "react";
import styled from "styled-components";

import { TypeProjectInfo } from "types/project";

// components
import { Form, FormInstance } from "antd";
import {
  ProjectAuthor,
  ProjectDesigner,
  ProjectName,
  ProjectVersion
} from "./Forms";

type TypeProps = {
  className?: string;
  // 初始化数据
  initialValues: TypeProjectInfo | undefined;
  form: FormInstance<TypeProjectInfo>;
};

type TypeRef = FormInstance<TypeProjectInfo>;

// 主题信息表单
function ProjectInfoForm(props: TypeProps, ref: React.ForwardedRef<TypeRef>) {
  const { form, initialValues, className } = props;

  useImperativeHandle(ref, () => form);

  const onInputChange = (field: keyof TypeProjectInfo) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      form.setFieldsValue({ [field]: event.target.value });
    };
  };
  // const onSelectChange = (field: keyof TypeProjectDescription) => {
  //   return (value: string) => {
  //     form.setFieldsValue({ [field]: value });
  //   };
  // };
  return (
    <Form
      name="FormProductInfo"
      className={className}
      form={form}
      colon={false}
      labelAlign="right"
      labelCol={{ span: 4 }}
      initialValues={initialValues}
    >
      <ProjectName onChange={onInputChange("name")} />
      <ProjectDesigner onChange={onInputChange("designer")} />
      <ProjectAuthor onChange={onInputChange("author")} />
      <ProjectVersion onChange={onInputChange("version")} />
    </Form>
  );
}

export default forwardRef<TypeRef, TypeProps>(ProjectInfoForm);
