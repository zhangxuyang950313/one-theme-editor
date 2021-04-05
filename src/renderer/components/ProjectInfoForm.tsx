import React, { forwardRef, useImperativeHandle } from "react";
import styled from "styled-components";

import { TypeUiVersion } from "@/types/project";

// components
import { Form, FormInstance } from "antd";
import {
  ProjectAuthor,
  ProjectDesigner,
  ProjectName,
  ProjectUIVersion,
  ProjectVersion
} from "./Forms";

export type TypeFormData = {
  name: string;
  designer: string;
  author: string;
  version: string;
  uiVersion: string;
};

type TypeProps = {
  // ui 版本列表，用于渲染 select
  uiVersions: TypeUiVersion[];
  // 初始化数据
  initialValues: TypeFormData | undefined;
  // // 外部监听表单改变
  // onChange: (event: React.FormEvent<HTMLFormElement>) => void;
  form: FormInstance<TypeFormData>;
};

type TypeRef = FormInstance<TypeFormData>;

// 主题信息表单
function ProjectInfoForm(props: TypeProps, ref: React.ForwardedRef<TypeRef>) {
  const { form, uiVersions, initialValues } = props;

  useImperativeHandle(ref, () => form);

  const onInputChange = (field: keyof TypeFormData) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      form.setFieldsValue({ [field]: event.target.value });
    };
  };
  const onSelectChange = (field: keyof TypeFormData) => {
    return (value: string) => {
      form.setFieldsValue({ [field]: value });
    };
  };
  return (
    <StyleProjectInfo>
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
        <ProjectUIVersion
          uiVersions={uiVersions}
          onChange={onSelectChange("uiVersion")}
        />
      </Form>
    </StyleProjectInfo>
  );
}

const StyleProjectInfo = styled.div`
  width: 100%;
`;

export default forwardRef<TypeRef, TypeProps>(ProjectInfoForm);
