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
  // 初始化数据
  initialValues: TypeProjectInfo | undefined;
  form: FormInstance<TypeProjectInfo>;
};

type TypeRef = FormInstance<TypeProjectInfo>;

// 主题信息表单
function ProjectInfoForm(props: TypeProps, ref: React.ForwardedRef<TypeRef>) {
  const { form, initialValues } = props;

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
    <StyleProjectInfoForm>
      <Form
        name="FormProductInfo"
        form={form}
        colon={false}
        labelAlign="right"
        labelCol={{ span: 6 }}
        initialValues={initialValues}
      >
        <ProjectName onChange={onInputChange("name")} />
        <ProjectDesigner onChange={onInputChange("designer")} />
        <ProjectAuthor onChange={onInputChange("author")} />
        <ProjectVersion onChange={onInputChange("version")} />
      </Form>
    </StyleProjectInfoForm>
  );
}

const StyleProjectInfoForm = styled.div`
  width: 100%;
  flex-shrink: 0;
`;

export default forwardRef<TypeRef, TypeProps>(ProjectInfoForm);
